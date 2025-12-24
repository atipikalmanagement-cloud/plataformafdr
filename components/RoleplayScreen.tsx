
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
  user: User;
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
    const [loadingMessage, setLoadingMessage] = useState('A inicializar coach de IA...');
    const [audioSuspended, setAudioSuspended] = useState(false);
    
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

    // Tentativa de resume automático se o browser suspender o áudio
    const tryResumeAudio = useCallback(async () => {
        if (outputAudioContextRef.current?.state === 'suspended') {
            await outputAudioContextRef.current.resume();
            setAudioSuspended(false);
        }
    }, []);

    useEffect(() => {
        let isActive = true;
        const startSession = async () => {
            if (!isActive) return;
            setStatus('CONNECTING');
            setErrorMessage(null);
            
            try {
                // 0. Inicialização imediata dos Contextos (mais chance de sucesso)
                const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext);
                inputAudioContextRef.current = new AudioCtx({ sampleRate: 16000 });
                outputAudioContextRef.current = new AudioCtx({ sampleRate: 24000 });

                // 1. Mic Request
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(err => {
                    throw new Error("Não foi possível aceder ao microfone. Por favor, permita o acesso nas definições do navegador.");
                });
                
                if (!isActive) { stream.getTracks().forEach(t => t.stop()); return; }
                mediaStreamRef.current = stream;

                mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
                mediaRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) userAudioChunksRef.current.push(e.data); };
                mediaRecorderRef.current.start(1000);

                // 2. IA Setup
                const apiKey = process.env.API_KEY;
                if (!apiKey) throw new Error("A chave da API não foi detetada. Contacte o administrador.");

                const ai = new GoogleGenAI({ apiKey });
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
                            
                            // Garantir que o áudio está ativo
                            if (outputAudioContextRef.current?.state === 'suspended') {
                                try {
                                    await outputAudioContextRef.current.resume();
                                } catch (e) {
                                    setAudioSuspended(true);
                                }
                            }

                            sourceRef.current = inputAudioContextRef.current!.createMediaStreamSource(stream);
                            scriptProcessorRef.current = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                            scriptProcessorRef.current.onaudioprocess = (e) => {
                                if (statusRef.current === 'ENDED' || !isConnectedRef.current) return;
                                const inputData = e.inputBuffer.getChannelData(0);
                                const int16 = new Int16Array(inputData.length);
                                for (let i = 0; i < inputData.length; i++) {
                                    int16[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
                                }
                                sessionPromise.then(s => s.sendRealtimeInput({ 
                                    media: { 
                                        data: encode(new Uint8Array(int16.buffer)), 
                                        mimeType: 'audio/pcm;rate=16000' 
                                    } as GenAiBlob 
                                }));
                            };
                            sourceRef.current.connect(scriptProcessorRef.current);
                            scriptProcessorRef.current.connect(inputAudioContextRef.current!.destination);
                        },
                        onmessage: async (m) => {
                           if (!isActive || statusRef.current === 'ENDED') return;
                           
                           if (!timerStartedRef.current && m.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
                               timerStartedRef.current = true;
                           }

                           if (m.serverContent?.outputTranscription) {
                               currentOutputTranscriptionRef.current += m.serverContent.outputTranscription.text;
                           }
                           if (m.serverContent?.inputTranscription) {
                               currentInputTranscriptionRef.current += m.serverContent.inputTranscription.text;
                           }
                           
                           if (m.serverContent?.turnComplete) {
                                const fi = currentInputTranscriptionRef.current.trim();
                                const fo = currentOutputTranscriptionRef.current.trim();
                                if (fi || fo) {
                                    setTranscript(prev => [
                                        ...prev, 
                                        ...(fi ? [{ speaker: 'user' as const, text: fi }] : []), 
                                        ...(fo ? [{ speaker: 'ai' as const, text: fo }] : [])
                                    ]);
                                }
                                currentInputTranscriptionRef.current = ''; 
                                currentOutputTranscriptionRef.current = '';
                           }

                           const ba = m.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                           if (ba && outputAudioContextRef.current) {
                                setStatus('SPEAKING');
                                const da = decode(ba); 
                                aiAudioChunksRef.current.push(da);
                                
                                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
                                const ab = await decodeAudioData(da, outputAudioContextRef.current, 24000, 1);
                                const s = outputAudioContextRef.current.createBufferSource();
                                s.buffer = ab; 
                                s.connect(outputAudioContextRef.current.destination);
                                
                                s.addEventListener('ended', () => {
                                    audioSourcesRef.current.delete(s);
                                    if (audioSourcesRef.current.size === 0 && statusRef.current !== 'ENDED') {
                                        setStatus('LISTENING');
                                    }
                                });
                                
                                s.start(nextStartTimeRef.current); 
                                nextStartTimeRef.current += ab.duration; 
                                audioSourcesRef.current.add(s);
                           }

                           if (m.serverContent?.interrupted) {
                               audioSourcesRef.current.forEach(src => { try { src.stop(); } catch(e){} });
                               audioSourcesRef.current.clear();
                               nextStartTimeRef.current = 0;
                           }
                        },
                        onerror: (e) => { 
                            console.error("Live Session Error:", e);
                            if (isActive) { 
                                setErrorMessage("A ligação ao servidor falhou. Verifique a sua internet."); 
                                setStatus('ERROR'); 
                                cleanup(); 
                            } 
                        },
                        onclose: () => { 
                            isConnectedRef.current = false; 
                            if (isActive && statusRef.current !== 'ENDED') setStatus('ENDED'); 
                        },
                    }
                });
                sessionPromiseRef.current = sessionPromise;
            } catch (err) { 
                console.error("Critical Startup Error:", err);
                if (isActive) { 
                    const msg = err instanceof Error ? err.message : "Erro inesperado ao iniciar o motor de áudio.";
                    setErrorMessage(msg); 
                    setStatus('ERROR'); 
                } 
            }
        };
        startSession();
        return () => { isActive = false; cleanup(); };
    }, [exercise, difficulty, scenarioData, cleanup, user]);

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col min-h-[85vh] p-4 md:p-8 animate-fade-in" onClick={tryResumeAudio}>
            <header className="flex items-center justify-between mb-12">
                <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-olive hover:text-amber transition-colors font-black uppercase tracking-widest text-[10px]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                    Abandonar Chamada
                </button>
                <div className="flex items-center gap-4">
                    <div className="hidden md:block text-right">
                        <h2 className="text-ghost font-black text-sm leading-none mb-1">{exercise.title}</h2>
                        <p className="text-[9px] text-amber font-black uppercase tracking-[0.2em]">{difficulty}</p>
                    </div>
                    <Timer timeLeft={timeLeft} />
                </div>
            </header>
            
            <div className="flex-grow flex flex-col items-center justify-center">
                <div className="relative mb-12">
                    <div className={`absolute -inset-10 bg-amber rounded-full blur-[80px] opacity-20 transition-all duration-700 ${status === 'SPEAKING' ? 'scale-125 opacity-40' : 'scale-100'}`}></div>
                    <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-amber/30 shadow-2xl transition-transform duration-500 hover:scale-105">
                        <img src={scenarioData.avatarUrl} alt={scenarioData.name} className="w-full h-full object-cover" />
                        {status === 'SPEAKING' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-gunmetal/80 to-transparent flex items-center justify-center gap-1.5 pb-4">
                                {[1,2,3,4,5,6].map(i => <div key={i} className={`w-1.5 bg-amber rounded-full animate-voice-bar-${i} h-6`}></div>)}
                            </div>
                        )}
                    </div>
                    <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 px-8 py-3 bg-gunmetal/80 backdrop-blur-xl border border-white/5 text-ghost text-xs font-black uppercase tracking-[0.2em] rounded-full shadow-2xl whitespace-nowrap transition-all duration-300 ${status === 'CONNECTING' ? 'opacity-50' : 'opacity-100'}`}>
                        {status === 'CONNECTING' ? loadingMessage : status === 'SPEAKING' ? 'Lead a falar...' : 'Pode falar agora'}
                    </div>
                </div>

                {audioSuspended && (
                    <button 
                        onClick={tryResumeAudio}
                        className="mb-8 px-6 py-2 bg-amber text-gunmetal font-black text-xs rounded-full animate-bounce shadow-xl"
                    >
                        CLIQUE PARA ATIVAR O SOM
                    </button>
                )}

                <div className="text-center space-y-2">
                    <h3 className="text-4xl font-black text-ghost tracking-tight">{scenarioData.name}</h3>
                    <p className="text-olive font-bold uppercase tracking-[0.2em] text-xs">A conversar com {user.name}</p>
                </div>
            </div>

            <footer className="mt-12 flex flex-col items-center gap-6">
                <button
                    onClick={endCall}
                    className="w-24 h-24 flex items-center justify-center bg-ochre text-ghost rounded-full shadow-2xl hover:bg-amber hover:text-gunmetal hover:scale-110 active:scale-95 transition-all duration-300 group shadow-ochre/20"
                    disabled={status === 'ENDED' || status === 'CONNECTING'}
                >
                    <PhoneIcon className="w-10 h-10 rotate-[135deg]" />
                </button>
                <p className={`text-sm font-black uppercase tracking-[0.2em] text-center max-w-xs ${status === 'ERROR' ? 'text-red-400' : 'text-olive/60 animate-pulse'}`}>
                    {status === 'CONNECTING' ? loadingMessage : 
                     status === 'LISTENING' ? 'Fale naturalmente para o microfone.' : 
                     status === 'SPEAKING' ? 'Ouça com atenção o cliente.' : 
                     status === 'ERROR' ? (errorMessage || 'Erro inesperado.') : 'Chamada Finalizada.'}
                </p>
            </footer>
            <style>{`
                @keyframes voice-bar { 0%, 100% { height: 6px; opacity: 0.5; } 50% { height: 24px; opacity: 1; } }
                .animate-voice-bar-1 { animation: voice-bar 0.4s infinite ease-in-out; }
                .animate-voice-bar-2 { animation: voice-bar 0.6s infinite ease-in-out 0.1s; }
                .animate-voice-bar-3 { animation: voice-bar 0.5s infinite ease-in-out 0.2s; }
                .animate-voice-bar-4 { animation: voice-bar 0.7s infinite ease-in-out 0.15s; }
                .animate-voice-bar-5 { animation: voice-bar 0.3s infinite ease-in-out 0.05s; }
                .animate-voice-bar-6 { animation: voice-bar 0.8s infinite ease-in-out 0.25s; }
            `}</style>
        </div>
    );
};

export default RoleplayScreen;
