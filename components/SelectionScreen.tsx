
import React, { useState } from 'react';
import { Exercise, Difficulty } from '../types';
import { EXERCISES } from '../constants';

interface SelectionScreenProps {
  onStart: (exercise: Exercise, difficulty: Difficulty) => void;
}

type WidgetType = 'OVERALL' | 'WEEKLY' | 'MONTHLY' | 'GOALS';

const SelectionScreen: React.FC<SelectionScreenProps> = ({ onStart }) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [showAllExercises, setShowAllExercises] = useState(false);
  
  const [widgets, setWidgets] = useState<WidgetType[]>(['OVERALL', 'WEEKLY', 'MONTHLY']);
  const [activeCustomizer, setActiveCustomizer] = useState<number | null>(null);

  const handleStart = () => {
    if (selectedExercise && selectedDifficulty) {
      onStart(selectedExercise, selectedDifficulty);
    }
  };

  const changeWidget = (index: number, type: WidgetType) => {
    const newWidgets = [...widgets];
    newWidgets[index] = type;
    setWidgets(newWidgets);
    setActiveCustomizer(null);
  };

  const CustomizerMenu = ({ index }: { index: number }) => (
    <div className="absolute top-12 right-0 z-[60] bg-white shadow-2xl rounded-2xl p-2 border border-olive/20 min-w-[180px] animate-fade-in text-left">
        <p className="px-4 py-2 text-[9px] font-black text-olive/50 uppercase tracking-widest">Alterar Widget</p>
        {(['OVERALL', 'WEEKLY', 'MONTHLY', 'GOALS'] as WidgetType[]).map(type => (
            <button 
                key={type}
                onClick={() => changeWidget(index, type)}
                className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-slate-50 rounded-lg transition-colors text-gunmetal flex items-center justify-between group"
            >
                {type === 'OVERALL' ? 'Estatísticas' : 
                 type === 'WEEKLY' ? 'Progresso' : 
                 type === 'MONTHLY' ? 'Performance' : 'Metas'}
                <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-amber" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
            </button>
        ))}
    </div>
  );

  const renderWidget = (type: WidgetType, index: number) => {
    const commonHeader = (title: string, isDark: boolean = false) => (
        <div className="flex justify-between items-center mb-6 relative">
            <div className="flex items-center gap-3">
                <div className={`w-1.5 h-6 rounded-full ${isDark ? 'bg-amber' : 'bg-ochre'}`}></div>
                <h3 className={`text-lg font-black tracking-tight ${isDark ? 'text-ghost' : 'text-gunmetal'}`}>{title}</h3>
            </div>
            <button 
                onClick={() => setActiveCustomizer(activeCustomizer === index ? null : index)}
                className={`${isDark ? 'text-ghost/30 hover:text-ghost' : 'text-olive hover:text-ochre'} transition-colors p-1`}
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v.01M12 12v.01M12 19v.01" />
                </svg>
                {activeCustomizer === index && <CustomizerMenu index={index} />}
            </button>
        </div>
    );

    switch(type) {
        case 'OVERALL':
            return (
                <div className="card-dark p-8 flex flex-col justify-between min-h-[340px] animate-fade-in h-full shadow-2xl hover:translate-y-[-4px] transition-all">
                    {commonHeader('Treinos Globais', true)}
                    <div className="grid grid-cols-2 gap-4 mb-6 text-left">
                        <div className="bg-white/5 p-4 rounded-2xl">
                            <p className="text-4xl font-black mb-1 text-amber">43</p>
                            <p className="text-[9px] uppercase font-bold tracking-[0.1em] opacity-60">Sessões Totais</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl">
                            <p className="text-4xl font-black mb-1 text-ghost">88%</p>
                            <p className="text-[9px] uppercase font-bold tracking-[0.1em] opacity-60">Score Médio</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-ghost/40 px-1">
                            <span>Status das Chamadas</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-white/10 rounded-xl p-3 text-center border border-white/5">
                                <p className="text-sm font-black text-amber">28</p>
                                <p className="text-[7px] uppercase font-bold opacity-50">Qualif.</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-3 text-center border border-white/5">
                                <p className="text-sm font-black text-ghost">14</p>
                                <p className="text-[7px] uppercase font-bold opacity-50">Perdidas</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-3 text-center border border-white/5">
                                <p className="text-sm font-black text-ghost">11</p>
                                <p className="text-[7px] uppercase font-bold opacity-50">Novas</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        case 'WEEKLY':
            return (
                <div className="card-glass p-8 flex flex-col min-h-[340px] text-ghost animate-fade-in h-full border-white/10 hover:border-amber/30 transition-all">
                    {commonHeader('Atividade Semanal', true)}
                    <div className="flex-grow flex items-end justify-between px-2 gap-3 pb-2">
                        {[40, 60, 45, 80, 50, 95, 70].map((h, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 flex-1 group/bar">
                                <div className="w-full bg-white/5 rounded-full h-32 relative overflow-hidden">
                                    <div 
                                        className={`absolute bottom-0 left-0 w-full rounded-full transition-all duration-1000 ${i === 5 ? 'bg-amber shadow-[0_0_15px_rgba(255,182,39,0.5)]' : 'bg-olive/40'} group-hover/bar:brightness-125`} 
                                        style={{ height: `${h}%` }}
                                    ></div>
                                </div>
                                <span className={`text-[9px] font-black ${i === 5 ? 'text-amber' : 'text-ghost/40'}`}>{['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'MONTHLY':
            return (
                <div className="card-white p-8 flex flex-col justify-between min-h-[340px] animate-fade-in h-full shadow-xl hover:translate-y-[-4px] transition-all border border-slate-100">
                    {commonHeader('Meta de Conversão')}
                    <div className="relative flex items-center justify-center my-4">
                        <div className="w-36 h-36 rounded-full border-[12px] border-slate-50 flex items-center justify-center relative">
                            <svg className="absolute inset-0 w-full h-full -rotate-90"><circle cx="72" cy="72" r="60" fill="none" stroke="#FFB627" strokeWidth="12" strokeDasharray="377" strokeDashoffset="45" strokeLinecap="round" /></svg>
                            <div className="text-center">
                                <p className="text-3xl font-black text-gunmetal leading-none">12</p>
                                <p className="text-[8px] font-bold text-olive uppercase tracking-widest mt-1">Vendas IA</p>
                            </div>
                        </div>
                    </div>
                    <button className="w-full py-4 bg-gunmetal text-amber rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase hover:bg-ochre hover:text-ghost transition-all shadow-lg active:scale-95">Ver Performance</button>
                </div>
            );
        case 'GOALS':
            return (
                <div className="card-white p-8 flex flex-col min-h-[340px] animate-fade-in h-full border border-slate-100 shadow-xl">
                    {commonHeader('Missões Ativas')}
                    <div className="space-y-4 text-left flex-grow">
                        {[
                            { t: '10 chamadas completas', c: true },
                            { t: 'Score médio > 85%', c: false },
                            { t: '5 Qualificações reais', c: false }
                        ].map((goal, i) => (
                            <div key={i} className={`flex items-center gap-4 p-3 rounded-2xl border transition-colors ${goal.c ? 'bg-amber/5 border-amber/20' : 'bg-slate-50 border-transparent'}`}>
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${goal.c ? 'bg-amber text-gunmetal' : 'bg-slate-200 text-slate-400'}`}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <span className={`text-xs font-bold ${goal.c ? 'text-gunmetal' : 'text-olive'}`}>{goal.t}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
    }
  };

  if (showAllExercises) {
    return (
        <div className="w-full space-y-10 animate-fade-up">
            <header className="flex items-end justify-between mb-12 border-b border-white/10 pb-8">
                <div className="text-left">
                    <button onClick={() => setShowAllExercises(false)} className="text-amber hover:text-ghost mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors group">
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M15 19l-7-7 7-7" /></svg> VOLTAR AO DASHBOARD
                    </button>
                    <h2 className="text-5xl font-black text-ghost tracking-tighter">Biblioteca de Treinos</h2>
                </div>
                <div className="hidden md:block text-right pb-1">
                    <p className="text-ghost opacity-40 text-xs font-bold uppercase tracking-widest">{EXERCISES.length} Exercícios Disponíveis</p>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {EXERCISES.map((exercise) => (
                    <div 
                        key={exercise.id}
                        onClick={() => { setSelectedExercise(exercise); setShowAllExercises(false); }}
                        className="card-white p-8 cursor-pointer hover:translate-y-[-8px] hover:shadow-[0_20px_60px_-15px_rgba(255,182,39,0.3)] hover:ring-2 hover:ring-amber transition-all relative group text-left shadow-xl"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-amber group-hover:text-gunmetal transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                            </div>
                            <span className="text-[8px] font-black bg-slate-100 text-olive px-2 py-1 rounded-md uppercase tracking-widest">10 MIN</span>
                        </div>
                        <h4 className="text-lg font-black mb-2 text-gunmetal leading-tight">{exercise.title}</h4>
                        <p className="text-xs text-olive font-bold opacity-60 line-clamp-2 leading-relaxed">{exercise.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
  }

  return (
    <div className="w-full space-y-16 animate-fade-up">
      {/* Grid de Widgets de topo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-0 relative z-20">
        <div className="lg:col-span-4 h-full">{renderWidget(widgets[0], 0)}</div>
        <div className="lg:col-span-5 h-full">{renderWidget(widgets[1], 1)}</div>
        <div className="lg:col-span-3 h-full">{renderWidget(widgets[2], 2)}</div>
      </div>

      <div className="space-y-10">
        <div className="flex items-end justify-between border-b border-white/5 pb-6">
            <div className="text-left">
                <h3 className="text-3xl font-black text-ghost tracking-tight">Treinos Sugeridos</h3>
                <p className="text-olive font-bold text-xs uppercase tracking-widest mt-1">Cenários de alta performance para hoje</p>
            </div>
            <button 
                onClick={() => setShowAllExercises(true)}
                className="text-[10px] font-black text-amber hover:text-ghost transition-colors flex items-center gap-2 group tracking-[0.2em] uppercase"
            >
                Ver todos os cenários <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M9 5l7 7-7 7" /></svg>
            </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {EXERCISES.slice(0, 3).map((exercise) => (
                <div 
                    key={exercise.id}
                    onClick={() => setSelectedExercise(exercise)}
                    className="card-white p-8 cursor-pointer transition-all hover:translate-y-[-8px] hover:shadow-[0_20px_50px_-10px_rgba(255,182,39,0.3)] hover:ring-2 hover:ring-amber group relative overflow-hidden min-h-[240px] flex flex-col justify-between text-left shadow-xl"
                >
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-gunmetal group-hover:text-amber transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                             <span className="text-[8px] font-black bg-slate-100 text-olive px-2 py-1 rounded-md uppercase tracking-widest">NOVO</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-gunmetal leading-tight group-hover:text-ochre transition-colors">{exercise.title}</h4>
                        <p className="text-[10px] font-black text-olive uppercase tracking-[0.2em] mt-2 opacity-60">Pratique agora</p>
                    </div>
                </div>
            ))}
            
            <div className="border-4 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center p-8 text-white/20 hover:border-amber hover:text-amber hover:bg-white/5 transition-all cursor-pointer min-h-[240px] group shadow-inner">
                <div className="w-16 h-16 rounded-full border-4 border-current flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 4v16m8-8H4" /></svg>
                </div>
                <span className="font-black text-lg text-center leading-none tracking-tight">Criar Cenário<br/><span className="text-[10px] uppercase tracking-widest opacity-60">Personalizado</span></span>
            </div>
        </div>
      </div>

      {/* MODAL COM BLOQUEIO TOTAL E DESIGN "USER-FRIENDLY" */}
      {selectedExercise && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
             <div className="absolute inset-[-25%] w-[150%] h-[150%] bg-gunmetal animate-fade-in pointer-events-none"></div>
             
             <div className="card-white w-full max-w-xl p-10 md:p-14 shadow-[0_80px_160px_rgba(0,0,0,0.8)] border-t-[12px] border-amber animate-fade-up relative z-10 overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-gunmetal pointer-events-none">
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>

                <div className="relative z-10 text-center mb-12">
                    <h3 className="text-4xl font-black text-gunmetal tracking-tighter mb-2">Pronto para treinar?</h3>
                    <p className="text-olive font-black uppercase tracking-[0.25em] text-[10px] opacity-70">Ajuste o nível do desafio IA</p>
                </div>
                
                <div className="space-y-3 mb-12">
                    {Object.values(Difficulty).map((diff) => (
                        <button
                            key={diff}
                            onClick={() => setSelectedDifficulty(diff)}
                            className={`w-full p-6 rounded-[28px] border-2 transition-all flex items-center justify-between group relative overflow-hidden ${selectedDifficulty === diff ? 'bg-slate-50 border-amber shadow-xl scale-[1.02]' : 'bg-white border-slate-100 text-gunmetal hover:border-olive/20'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-colors ${selectedDifficulty === diff ? 'bg-amber text-gunmetal' : 'bg-slate-100 text-olive'}`}>
                                    {diff === Difficulty.EASY ? '1' : diff === Difficulty.MEDIUM ? '2' : '3'}
                                </div>
                                <div className="text-left">
                                    <span className="font-black text-lg tracking-tight block leading-none">{diff}</span>
                                    <span className="text-[9px] font-bold text-olive uppercase tracking-widest mt-1">
                                        {diff === Difficulty.EASY ? 'Cooperativo' : diff === Difficulty.MEDIUM ? 'Cético' : 'Muito Difícil'}
                                    </span>
                                </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-[3px] flex items-center justify-center transition-all ${selectedDifficulty === diff ? 'border-amber bg-amber' : 'border-slate-200'}`}>
                                {selectedDifficulty === diff && <div className="w-2 h-2 bg-ghost rounded-full"></div>}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                    <button 
                        onClick={() => { setSelectedExercise(null); setSelectedDifficulty(null); }} 
                        className="text-[10px] font-black text-olive hover:text-ochre transition-colors uppercase tracking-[0.3em]"
                    >
                        DESISTIR
                    </button>
                    <button 
                        onClick={handleStart}
                        disabled={!selectedDifficulty}
                        className="w-full sm:w-auto px-16 py-6 bg-slate-200 text-olive disabled:opacity-50 disabled:cursor-not-allowed rounded-3xl font-black text-xl transition-all hover:bg-amber hover:text-gunmetal hover:shadow-[0_20px_40px_rgba(255,182,39,0.4)] active:scale-95 uppercase tracking-widest"
                        style={selectedDifficulty ? { backgroundColor: '#FFB627', color: '#393D3F' } : {}}
                    >
                        Começar Call
                    </button>
                </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default SelectionScreen;
