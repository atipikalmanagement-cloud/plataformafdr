
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenAiBlob } from '@google/genai';
import { Exercise, Difficulty, Transcript, ScenarioData, User } from '../types';
import { generateSystemPrompt } from '../constants';
import { PhoneIcon } from './icons/Icons';
import { decode, encode, decodeAudioData, pcmToWav } from '../utils/audioUtils';


interface RoleplayScreenProps {
  exercise: Exercise;
  difficulty: Difficulty;
  scenarioData: ScenarioData;
  onRoleplayEnd: (transcript: Transcript[], userAudio: Blob, aiAudio: Blob) => void;
  onBack: () => void;
  user: User; // Added user prop to access DISC profile
}

type Status = 'IDLE' | 'CONNECTING' | 'LISTENING' | 'SPEAKING' | 'ENDED' | 'ERROR';

const Timer: React.FC<{ timeLeft: number }> = ({ timeLeft }) => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const isCritical = timeLeft < 60;
    return (
        <div className={`text-xl font-bold font-mono px-4 py-2 rounded-xl backdrop-blur-md border border-ghost/10 shadow-lg ${isCritical ? 'text-ochre animate-pulse' : 'text-amber'}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
    );
};

const RoleplayScreen: React.FC<RoleplayScreenProps> = ({ exercise, difficulty, scenarioData, onRoleplayEnd, onBack, user }) => {
    const [status, setStatus] = useState<Status>('IDLE');
    const [transcript, setTranscript] = useState<Transcript[]>([]);
    const [timeLeft, setTimeLeft] = useState(600);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const isConnectedRef = useRef(false);
    
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const userAudioChunksRef = useRef<Blob[]>([]);
    const aiAudioChunksRef = useRef<Uint8Array[]>([]);

    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);

    const currentInputTranscriptionRef = useRef('');
    const currentOutputTranscriptionRef = useRef('');
    const nextStartTimeRef = useRef(0);
    const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const timerStartedRef = useRef(false);

    const statusRef = useRef<Status>(status);
    useEffect(() => {
        statusRef.current = status;
    }, [status]);

    const cleanup = useCallback(() => {
        try {
            if (sourceRef.current) sourceRef.current.disconnect();
            if (scriptProcessorRef.current) scriptProcessorRef.current.disconnect();
        } catch (e) {}

        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }

        if (inputAudioContextRef.current) {
            inputAudioContextRef.current.close().catch(() => {});
            inputAudioContextRef.current = null;
        }
        if (outputAudioContextRef.current) {
            outputAudioContextRef.current.close().catch(() => {});
            outputAudioContextRef.current = null;
        }

        audioSourcesRef.current.forEach(source => { try { source.stop(); } catch (e) {} });
        audioSourcesRef.current.clear();
        nextStartTimeRef.current = 0;
        isConnectedRef.current = false;
    }, []);

    const endCall = useCallback(async () => {
        if (statusRef.current === 'ENDED' || statusRef.current === 'IDLE') return;
        setStatus('ENDED');
        
        try {
            if (sessionPromiseRef.current) {
                const session = await sessionPromiseRef.current;
                session.close();
            }
        } catch (e) {}

        cleanup();

        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }

        const finalTranscript = [
            ...transcript,
            ...(currentInputTranscriptionRef.current ? [{ speaker: 'user' as const, text: currentInputTranscriptionRef.current }] : []),
            ...(currentOutputTranscriptionRef.current ? [{ speaker: 'ai' as const, text: currentOutputTranscriptionRef.current }] : [])
         ];
        
         const userAudioBlob = new Blob(userAudioChunksRef.current, { type: 'audio/webm' });

         const totalLength = aiAudioChunksRef.current.reduce((acc, chunk) => acc + chunk.length, 0);
         const combinedAiPcm = new Uint8Array(totalLength);
         let offset = 0;
         aiAudioChunksRef.current.forEach(chunk => {
             combinedAiPcm.set(chunk, offset);
             offset += chunk.length;
         });
         const aiAudioWavBlob = pcmToWav(combinedAiPcm, { sampleRate: 24000, channels: 1 });
         
        onRoleplayEnd(finalTranscript, userAudioBlob, aiAudioWavBlob);

    }, [cleanup, onRoleplayEnd, transcript]);
    
    useEffect(() => {
        if (timerStartedRef.current && timeLeft <= 0) endCall();
        if (!timerStartedRef.current || status === 'ENDED') return;
        const intervalId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft, status, endCall]);

    useEffect(() => {
        let isActive = true;
        const startSession = async () => {
            if (!isActive) return;
            setStatus('CONNECTING');
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                if (!isActive) { stream.getTracks().forEach(t => t.stop()); return; }
                mediaStreamRef.current = stream;

                mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
                mediaRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) userAudioChunksRef.current.push(e.data); };
                mediaRecorderRef.current.start(1000);

                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                const systemInstruction = generateSystemPrompt(exercise, difficulty, scenarioData, user);
                const voiceName = scenarioData.gender === 'male' ? 'Puck' : 'Charon';

                const sessionPromise = ai.live.connect({
                    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                    config: {
                        responseModalities: [Modality.AUDIO],
                        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
                        systemInstruction,
                        inputAudioTranscription: {},
                        outputAudioTranscription: {}
                    },
                    callbacks: {
                        onopen: async () => {
                            if (!isActive || statusRef.current === 'ENDED') return;
                            setStatus('LISTENING');
                            isConnectedRef.current = true;
                            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                            sourceRef.current = inputAudioContextRef.current.createMediaStreamSource(stream);
                            scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                            scriptProcessorRef.current.onaudioprocess = (e) => {
                                if (statusRef.current === 'ENDED' || !isConnectedRef.current) return;
                                const inputData = e.inputBuffer.getChannelData(0);
                                const int16 = new Int16Array(inputData.length);
                                for (let i = 0; i < inputData.length; i++) int16[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
                                sessionPromise.then(s => s.sendRealtimeInput({ media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } as GenAiBlob }));
                            };
                            sourceRef.current.connect(scriptProcessorRef.current);
                            scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
                        },
                        onmessage: async (m) => {
                           if (!isActive || statusRef.current === 'ENDED') return;
                           if (!timerStartedRef.current && m.serverContent?.modelTurn?.parts[0]?.inlineData?.data) timerStartedRef.current = true;
                           if (m.serverContent?.outputTranscription) currentOutputTranscriptionRef.current += m.serverContent.outputTranscription.text;
                           if (m.serverContent?.inputTranscription) currentInputTranscriptionRef.current += m.serverContent.inputTranscription.text;
                           if (m.serverContent?.turnComplete) {
                                const fi = currentInputTranscriptionRef.current.trim();
                                const fo = currentOutputTranscriptionRef.current.trim();
                                if (fi || fo) setTranscript(prev => [...prev, ...(fi ? [{ speaker: 'user' as const, text: fi }] : []), ...(fo ? [{ speaker: 'ai' as const, text: fo }] : [])]);
                                currentInputTranscriptionRef.current = ''; currentOutputTranscriptionRef.current = '';
                           }
                           const ba = m.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                           if (ba && outputAudioContextRef.current) {
                                setStatus('SPEAKING');
                                const da = decode(ba); aiAudioChunksRef.current.push(da);
                                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
                                const ab = await decodeAudioData(da, outputAudioContextRef.current, 24000, 1);
                                const s = outputAudioContextRef.current.createBufferSource();
                                s.buffer = ab; s.connect(outputAudioContextRef.current.destination);
                                s.addEventListener('ended', () => {
                                    audioSourcesRef.current.delete(s);
                                    if (audioSourcesRef.current.size === 0 && statusRef.current !== 'ENDED') setStatus('LISTENING');
                                });
                                s.start(nextStartTimeRef.current); nextStartTimeRef.current += ab.duration; audioSourcesRef.current.add(s);
                           }
                        },
                        onerror: (e) => { if (isActive) { setErrorMessage("Erro na sessão"); setStatus('ERROR'); cleanup(); } },
                        onclose: () => { isConnectedRef.current = false; if (isActive && statusRef.current !== 'ENDED') setStatus('ENDED'); },
                    }
                });
                sessionPromiseRef.current = sessionPromise;
            } catch (err) { if (isActive) { setErrorMessage("Falha ao iniciar áudio"); setStatus('ERROR'); } }
        };
        startSession();
        return () => { isActive = false; cleanup(); };
    }, [exercise, difficulty, scenarioData, cleanup, user]);

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col min-h-[85vh] p-4 md:p-8 animate-fade-in">
            <header className="flex items-center justify-between mb-12">
                <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-olive hover:text-amber transition-colors font-semibold">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                    Abandonar
                </button>
                <div className="flex items-center gap-4">
                    <div className="hidden md:block text-right">
                        <h2 className="text-ghost font-bold leading-none mb-1">{exercise.title}</h2>
                        <p className="text-xs text-amber font-bold uppercase tracking-widest">{difficulty}</p>
                    </div>
                    <Timer timeLeft={timeLeft} />
                </div>
            </header>
            
            <div className="flex-grow flex flex-col items-center justify-center">
                <div className="relative mb-12">
                    <div className={`absolute -inset-10 bg-amber rounded-full blur-[80px] opacity-20 transition-all duration-500 ${status === 'SPEAKING' ? 'scale-125 opacity-40' : 'scale-100'}`}></div>
                    <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-amber/30 shadow-2xl">
                        <img src={scenarioData.avatarUrl} alt={scenarioData.name} className="w-full h-full object-cover" />
                        {status === 'SPEAKING' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-ochre/40 to-transparent flex items-center justify-center gap-1">
                                {[1,2,3,4,5].map(i => <div key={i} className={`w-1 bg-amber rounded-full animate-voice-bar-${i} h-4`}></div>)}
                            </div>
                        )}
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-ochre text-ghost text-xs font-bold rounded-full shadow-lg whitespace-nowrap">
                        {status === 'SPEAKING' ? 'CLIENTE A FALAR' : 'A OUVIR...'}
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-3xl font-extrabold text-ghost tracking-tight">{scenarioData.name}</h3>
                    <p className="text-olive font-medium">Digital Revolution Call</p>
                </div>
            </div>

            <footer className="mt-12 flex flex-col items-center gap-6">
                <button
                    onClick={endCall}
                    className="w-20 h-20 flex items-center justify-center bg-ochre text-ghost rounded-full shadow-2xl hover:bg-amber hover:text-gunmetal hover:scale-110 active:scale-95 transition-all duration-300 group"
                    disabled={status === 'ENDED' || status === 'CONNECTING'}
                >
                    <PhoneIcon className="w-8 h-8 rotate-[135deg]" />
                </button>
                <p className={`text-sm font-medium ${status === 'ERROR' ? 'text-red-400' : 'text-olive animate-pulse'}`}>
                    {status === 'CONNECTING' ? 'A estabelecer ligação...' : 
                     status === 'LISTENING' ? 'Fale naturalmente.' : 
                     status === 'SPEAKING' ? 'O cliente está a responder...' : 
                     status === 'ERROR' ? (errorMessage || 'Erro na ligação.') : 'Chamada terminada.'}
                </p>
            </footer>
            <style>{`
                @keyframes voice-bar { 0%, 100% { height: 4px; } 50% { height: 16px; } }
                .animate-voice-bar-1 { animation: voice-bar 0.5s infinite ease-in-out; }
                .animate-voice-bar-2 { animation: voice-bar 0.7s infinite ease-in-out 0.1s; }
                .animate-voice-bar-3 { animation: voice-bar 0.6s infinite ease-in-out 0.2s; }
                .animate-voice-bar-4 { animation: voice-bar 0.8s infinite ease-in-out 0.15s; }
                .animate-voice-bar-5 { animation: voice-bar 0.4s infinite ease-in-out 0.05s; }
            `}</style>
        </div>
    );
};

export default RoleplayScreen;
