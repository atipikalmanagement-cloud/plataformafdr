
import React from 'react';
import { Recording, ExerciseType } from '../types';

interface GoalsScreenProps {
    recordings: Recording[];
}

const GOAL_TOTAL_CALLS = 10;
const GOAL_PER_EXERCISE = 2;

const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
};

const ProgressBar: React.FC<{ value: number; max: number; label: string }> = ({ value, max, label }) => {
    const percentage = Math.min(100, (value / max) * 100);
    const isCompleted = value >= max;
    
    return (
        <div className="w-full bg-white/5 p-5 rounded-2xl border border-white/5 transition-all hover:border-white/10 group">
            <div className="flex justify-between items-center mb-3">
                <span className={`text-sm font-bold uppercase tracking-widest ${isCompleted ? 'text-teal-400' : 'text-slate-400'}`}>{label}</span>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white bg-white/10 px-2 py-1 rounded-md">{value} / {max}</span>
                    {isCompleted && (
                        <div className="bg-teal-500 text-white rounded-full p-0.5">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out relative ${isCompleted ? 'bg-teal-500 shadow-[0_0_10px_rgba(45,212,191,0.5)]' : 'bg-gradient-to-r from-teal-600 to-teal-400'}`} 
                    style={{ width: `${percentage}%` }}
                >
                    {!isCompleted && percentage > 0 && (
                        <div className="absolute top-0 right-0 h-full w-2 bg-white/30 blur-sm"></div>
                    )}
                </div>
            </div>
        </div>
    );
}

const GoalsScreen: React.FC<GoalsScreenProps> = ({ recordings }) => {
    const todayRecordings = recordings.filter(rec => isToday(new Date(rec.date)));
    const callsToday = todayRecordings.length;

    const exerciseCounts = todayRecordings.reduce((acc, rec) => {
        acc[rec.exercise.type] = (acc[rec.exercise.type] || 0) + 1;
        return acc;
    }, {} as Record<ExerciseType, number>);

    const exerciseGoals = [
        { type: ExerciseType.QUALIFY, title: 'Qualificação' },
        { type: ExerciseType.COLD_QUALIFY, title: 'Qualificação Fria' },
        { type: ExerciseType.EMOTION, title: 'Reunião: Emocional' },
        { type: ExerciseType.PROPOSAL, title: 'Apresentação de Proposta' },
        { type: ExerciseType.OBJECTIONS, title: 'Gestão de Objeções' },
    ];

    return (
        <div className="w-full max-w-5xl mx-auto animate-fade-in">
            <header className="mb-12">
                <span className="text-teal-500 font-bold tracking-[0.3em] text-xs uppercase mb-2 block">Progresso Diário</span>
                <h1 className="text-4xl font-extrabold text-white tracking-tight">O seu plano de treino</h1>
                <p className="text-slate-400 mt-2">A consistência é a chave para o sucesso nas vendas. Complete as metas sugeridas.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-3xl p-8 shadow-2xl shadow-teal-500/20 text-white relative overflow-hidden">
                         {/* Abstract shape */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                        
                        <h2 className="text-lg font-bold mb-8 uppercase tracking-widest opacity-80">Total de Hoje</h2>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-7xl font-black">{callsToday}</span>
                            <span className="text-xl font-bold opacity-60">/ {GOAL_TOTAL_CALLS}</span>
                        </div>
                        <p className="text-sm font-medium opacity-80">Chamadas realizadas</p>
                        
                        <div className="mt-10 pt-6 border-t border-white/10">
                            <p className="text-xs font-bold leading-relaxed">
                                {callsToday >= GOAL_TOTAL_CALLS 
                                    ? "Excelente! Meta diária atingida. Você está no caminho certo." 
                                    : `Faltam ${GOAL_TOTAL_CALLS - callsToday} chamadas para completar o treino de hoje.`}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                         <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Destaque Semanal</h3>
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center border border-yellow-500/20">
                                <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">3 Dias Seguidos!</p>
                                <p className="text-xs text-slate-500 font-medium">Continue assim.</p>
                            </div>
                         </div>
                    </div>
                </div>
                
                <div className="lg:col-span-8">
                    <div className="bg-white/5 rounded-3xl p-8 border border-white/10 h-full">
                        <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-teal-500 rounded-full"></span>
                            Treino por Cenário
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {exerciseGoals.map(goal => (
                                <ProgressBar 
                                    key={goal.type}
                                    value={exerciseCounts[goal.type] || 0} 
                                    max={GOAL_PER_EXERCISE} 
                                    label={goal.title} 
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoalsScreen;
