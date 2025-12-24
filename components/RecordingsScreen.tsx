
import React, { useState } from 'react';
import { Recording, AnalysisResult } from '../types';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';


const RecordingDetail: React.FC<{ recording: Recording, onBack: () => void }> = ({ recording, onBack }) => {
    return (
        <div className="animate-fade-in max-w-6xl mx-auto">
             <button onClick={onBack} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar às Gravações
            </button>
            
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-8 border-b border-white/5">
                    <div>
                        <h2 className="text-3xl font-black text-white mb-2">{recording.exercise.title}</h2>
                        <div className="flex flex-wrap gap-4 items-center">
                            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-teal-400 border border-white/10 uppercase tracking-widest">
                                {recording.difficulty}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                                {new Date(recording.date).toLocaleString('pt-PT')}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="text-right">
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Score Obtido</p>
                            <p className="text-3xl font-black text-teal-400">{recording.analysis.score}%</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Feedback Column */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-teal-500 rounded-full"></span>
                                Resumo Executivo
                            </h3>
                            <p className="text-slate-400 leading-relaxed italic text-sm">"{recording.analysis.summary}"</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-red-500/5 p-6 rounded-2xl border border-red-500/10">
                                <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4">Pontos de Falha</h4>
                                <ul className="space-y-3">
                                    {(recording.analysis.failedPoints || []).map((p, i) => (
                                        <li key={i} className="text-xs text-slate-300 leading-relaxed flex gap-2">
                                            <span className="w-1 h-1 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-teal-500/5 p-6 rounded-2xl border border-teal-500/10">
                                <h4 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-4">Atenção Próximo Treino</h4>
                                <ul className="space-y-3">
                                    {(recording.analysis.nextSteps || []).map((s, i) => (
                                        <li key={i} className="text-xs text-slate-300 leading-relaxed flex gap-2">
                                            <span className="w-1 h-1 bg-teal-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Áudios da Chamada</h3>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col gap-4">
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Vendedor</p>
                                    <audio controls src={recording.userAudioUrl} className="w-full h-8"></audio>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Lead (IA)</p>
                                    <audio controls src={recording.aiAudioUrl} className="w-full h-8"></audio>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transcript Column */}
                    <div className="lg:col-span-5">
                        <div className="bg-slate-900/50 rounded-3xl border border-white/5 p-6 h-full max-h-[700px] flex flex-col">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Transcrição</h3>
                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                {recording.transcript.map((item, index) => (
                                    <div key={index} className={`flex flex-col ${item.speaker === 'user' ? 'items-end' : 'items-start'}`}>
                                        <span className="text-[9px] font-bold text-slate-600 uppercase mb-1">{item.speaker === 'user' ? 'Tu' : 'Cliente'}</span>
                                        <p className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[90%] ${
                                            item.speaker === 'user' 
                                            ? 'bg-teal-500 text-white rounded-tr-none' 
                                            : 'bg-white/5 text-slate-300 border border-white/10 rounded-tl-none'
                                        }`}>
                                            {item.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const RecordingsScreen: React.FC<{ recordings: Recording[] }> = ({ recordings }) => {
    const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);

    if (selectedRecording) {
        return <RecordingDetail recording={selectedRecording} onBack={() => setSelectedRecording(null)} />;
    }

    return (
        <div className="w-full max-w-5xl mx-auto animate-fade-in">
            <header className="mb-12">
                <span className="text-teal-500 font-bold tracking-[0.3em] text-xs uppercase mb-2 block">Histórico de Performance</span>
                <h1 className="text-4xl font-extrabold text-white tracking-tight">As Suas Gravações</h1>
                <p className="text-slate-400 mt-2">Reveja as suas chamadas para analisar a sua evolução e identificar padrões.</p>
            </header>

            {recordings.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-500">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </div>
                    <p className="text-slate-400 font-medium">Ainda não tem nenhuma gravação guardada.</p>
                    <p className="text-slate-500 text-sm mt-1">Complete o seu primeiro roleplay para começar o histórico.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recordings.map(rec => (
                        <div
                            key={rec.id}
                            onClick={() => setSelectedRecording(rec)}
                            className="glass-card p-6 rounded-2xl cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-white text-lg group-hover:text-teal-400 transition-colors">{rec.exercise.title}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{new Date(rec.date).toLocaleDateString('pt-PT')} • {rec.difficulty}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-teal-500">{rec.analysis.score}%</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                                <div className={`w-2 h-2 rounded-full ${rec.analysis.isQualified ? 'bg-teal-500' : 'bg-red-500'}`}></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    {rec.analysis.isQualified ? 'Lead Qualificado' : 'Lead Não Qualificado'}
                                </span>
                                <div className="ml-auto flex -space-x-2">
                                     <div className="w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-[10px] text-teal-400">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        </svg>
                                     </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecordingsScreen;
