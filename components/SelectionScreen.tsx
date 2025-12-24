
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
    <div className="absolute top-12 right-0 z-[60] bg-ghost shadow-2xl rounded-2xl p-2 border border-olive/20 min-w-[160px] animate-fade-in text-left">
        {(['OVERALL', 'WEEKLY', 'MONTHLY', 'GOALS'] as WidgetType[]).map(type => (
            <button 
                key={type}
                onClick={() => changeWidget(index, type)}
                className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-100 rounded-lg transition-colors text-gunmetal"
            >
                {type === 'OVERALL' ? 'Estatísticas Gerais' : 
                 type === 'WEEKLY' ? 'Progresso Semanal' : 
                 type === 'MONTHLY' ? 'Performance' : 'Metas Mensais'}
            </button>
        ))}
    </div>
  );

  const renderWidget = (type: WidgetType, index: number) => {
    const commonHeader = (title: string, isDark: boolean = false) => (
        <div className="flex justify-between items-start mb-6 relative">
            <h3 className={`text-xl font-bold tracking-tight ${isDark ? 'text-ghost opacity-80' : 'text-gunmetal'}`}>{title}</h3>
            <div className="flex gap-2">
                <button 
                    onClick={() => setActiveCustomizer(activeCustomizer === index ? null : index)}
                    className={`${isDark ? 'text-ghost opacity-50 hover:opacity-100' : 'text-olive hover:text-ochre'} transition-opacity`}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </button>
                {activeCustomizer === index && <CustomizerMenu index={index} />}
            </div>
        </div>
    );

    switch(type) {
        case 'OVERALL':
            return (
                <div className="card-dark p-10 flex flex-col justify-between min-h-[340px] animate-fade-in h-full shadow-2xl">
                    {commonHeader('Estatísticas Gerais', true)}
                    <div className="flex gap-12 my-8">
                        <div>
                            <p className="text-6xl font-black mb-1">43</p>
                            <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60">Treinos Totais</p>
                        </div>
                        <div className="w-px h-16 bg-ghost/20 mt-2"></div>
                        <div>
                            <p className="text-6xl font-black mb-1">2</p>
                            <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60">Metas Pendentes</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-ghost/10 rounded-2xl p-4 text-center">
                            <div className="w-2 h-2 rounded-full bg-amber mx-auto mb-3"></div>
                            <p className="text-lg font-black text-ghost">28</p>
                            <p className="text-[8px] uppercase font-bold opacity-60">Projetos</p>
                        </div>
                        <div className="bg-ghost/10 rounded-2xl p-4 text-center">
                            <div className="w-2 h-2 rounded-full border border-amber mx-auto mb-3"></div>
                            <p className="text-lg font-black text-ghost">14</p>
                            <p className="text-[8px] uppercase font-bold opacity-60">Em curso</p>
                        </div>
                        <div className="bg-ghost/10 rounded-2xl p-4 text-center">
                            <div className="w-2 h-2 rounded-full bg-amber flex items-center justify-center mx-auto mb-3"><div className="w-1 h-1 bg-ochre rounded-full"></div></div>
                            <p className="text-lg font-black text-ghost">11</p>
                            <p className="text-[8px] uppercase font-bold opacity-60">Concluídos</p>
                        </div>
                    </div>
                </div>
            );
        case 'WEEKLY':
            return (
                <div className="card-glass p-10 flex flex-col min-h-[340px] text-ghost animate-fade-in h-full border-amber/20">
                    {commonHeader('Progresso Semanal', true)}
                    <div className="flex-grow flex items-end justify-between px-2 gap-4">
                        {[40, 60, 45, 80, 50, 95, 70].map((h, i) => (
                            <div key={i} className="flex flex-col items-center gap-4 flex-1">
                                <div className="w-full bg-ghost/10 rounded-full h-32 relative overflow-hidden">
                                    <div className={`absolute bottom-0 left-0 w-full rounded-full transition-all duration-1000 ${i === 5 ? 'bg-amber' : 'bg-olive'}`} style={{ height: `${h}%` }}></div>
                                </div>
                                <span className={`text-[11px] font-bold ${i === 5 || i === 6 ? 'text-amber' : 'text-olive'}`}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'MONTHLY':
            return (
                <div className="card-white p-10 flex flex-col justify-between min-h-[340px] animate-fade-in h-full">
                    {commonHeader('Performance')}
                    <div className="relative flex items-center justify-center my-6">
                        <div className="w-32 h-32 rounded-full border-[10px] border-slate-50 flex items-center justify-center relative">
                            <svg className="absolute inset-0 w-full h-full -rotate-90"><circle cx="64" cy="64" r="54" fill="none" stroke="#FFB627" strokeWidth="10" strokeDasharray="339" strokeDashoffset="60" strokeLinecap="round" /></svg>
                            <div className="text-center"><p className="text-2xl font-black text-gunmetal">120%</p><p className="text-[8px] font-bold text-olive uppercase">da Meta</p></div>
                        </div>
                    </div>
                    <button className="w-full py-3 bg-slate-100 border border-olive/10 rounded-2xl font-bold text-sm text-gunmetal flex items-center justify-center gap-2 hover:bg-amber hover:text-ghost transition-all text-center">Relatório Mensal</button>
                </div>
            );
        case 'GOALS':
            return (
                <div className="card-white p-10 flex flex-col min-h-[340px] animate-fade-in h-full">
                    {commonHeader('Metas do Mês')}
                    <div className="space-y-4 text-left">
                        {['10 chamadas completas', 'Score médio > 85%', '5 Qualificações reais'].map((goal, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className={`w-5 h-5 rounded-md border-2 ${i === 0 ? 'bg-amber border-amber' : 'border-olive'}`}>
                                    {i === 0 && <svg className="w-4 h-4 text-ghost" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>}
                                </div>
                                <span className="text-sm font-bold text-gunmetal">{goal}</span>
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
            <header className="flex items-center justify-between mb-8">
                <div>
                    <button onClick={() => setShowAllExercises(false)} className="text-olive hover:text-amber mb-4 flex items-center gap-2 text-sm font-bold transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M15 19l-7-7 7-7" /></svg> Voltar ao Dashboard
                    </button>
                    <h2 className="text-4xl font-black text-ghost">Todos os Exercícios</h2>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {EXERCISES.map((exercise) => (
                    <div 
                        key={exercise.id}
                        onClick={() => { setSelectedExercise(exercise); setShowAllExercises(false); }}
                        className="card-white p-8 cursor-pointer hover:-translate-y-2 hover:ring-2 hover:ring-amber transition-all relative group text-left"
                    >
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-ochre group-hover:text-ghost transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        </div>
                        <h4 className="text-lg font-black mb-2 text-gunmetal">{exercise.title}</h4>
                        <p className="text-xs text-olive font-bold mb-6 line-clamp-2">{exercise.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
  }

  return (
    <div className="w-full space-y-16 animate-fade-up">
      {/* Grid de Widgets - mt-0 e sem paddings redundantes para respeitar o Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-0 relative z-20">
        <div className="lg:col-span-4 h-full">{renderWidget(widgets[0], 0)}</div>
        <div className="lg:col-span-5 h-full">{renderWidget(widgets[1], 1)}</div>
        <div className="lg:col-span-3 h-full">{renderWidget(widgets[2], 2)}</div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-ghost">Qual será o treino hoje?</h3>
            <button 
                onClick={() => setShowAllExercises(true)}
                className="text-sm font-bold text-olive hover:text-amber transition-colors flex items-center gap-1 group"
            >
                Ver todos <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M9 5l7 7-7 7" /></svg>
            </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {EXERCISES.slice(0, 3).map((exercise) => (
                <div 
                    key={exercise.id}
                    onClick={() => setSelectedExercise(exercise)}
                    className="card-white p-8 cursor-pointer transition-all hover:-translate-y-2 hover:ring-2 hover:ring-amber group relative overflow-hidden min-h-[220px] flex flex-col justify-between text-left"
                >
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-gunmetal group-hover:text-amber transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        </div>
                        <div className="text-olive"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 5v.01M12 12v.01M12 19v.01" /></svg></div>
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-gunmetal leading-tight">{exercise.title}</h4>
                        <p className="text-[11px] font-bold text-olive uppercase tracking-widest mt-1">Roleplay Ativo</p>
                    </div>
                </div>
            ))}
            
            <div className="border-4 border-dashed border-olive/30 rounded-[32px] flex flex-col items-center justify-center p-8 text-olive/40 hover:border-amber hover:text-amber transition-all cursor-pointer min-h-[220px]">
                <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 4v16m8-8H4" /></svg>
                <span className="font-black text-lg text-center leading-none">Add Task</span>
            </div>
        </div>
      </div>

      {/* MODAL COM BLUR ABSOLUTO TOTAL (Z-INDEX 9999) */}
      {selectedExercise && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gunmetal/60 backdrop-blur-[80px] animate-fade-in overflow-hidden">
             <div className="card-white w-full max-w-xl p-10 md:p-14 shadow-[0_60px_120px_rgba(0,0,0,0.8)] border-t-[10px] border-amber animate-fade-up relative">
                <h3 className="text-4xl font-black mb-3 text-gunmetal tracking-tight text-center">Configurar Chamada</h3>
                <p className="text-olive font-bold mb-14 uppercase tracking-[0.2em] text-[10px] text-center opacity-70">Selecione o perfil do cliente para hoje</p>
                
                <div className="space-y-4 mb-14">
                    {Object.values(Difficulty).map((diff) => (
                        <button
                            key={diff}
                            onClick={() => setSelectedDifficulty(diff)}
                            className={`w-full p-8 rounded-[32px] border-2 transition-all flex items-center justify-between group ${selectedDifficulty === diff ? 'bg-ghost border-amber text-gunmetal shadow-2xl scale-[1.02]' : 'bg-slate-50 border-transparent text-gunmetal hover:bg-white hover:border-olive/10'}`}
                        >
                            <span className="font-extrabold text-2xl tracking-tight">{diff}</span>
                            <div className={`w-6 h-6 rounded-full border-[3px] flex items-center justify-center transition-all ${selectedDifficulty === diff ? 'border-amber bg-amber' : 'border-olive group-hover:border-gunmetal'}`}>
                                {selectedDifficulty === diff && <div className="w-2.5 h-2.5 bg-ghost rounded-full"></div>}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                    <button 
                        onClick={() => { setSelectedExercise(null); setSelectedDifficulty(null); }} 
                        className="text-xs font-black text-olive hover:text-ochre transition-colors uppercase tracking-[0.2em]"
                    >
                        CANCELAR
                    </button>
                    <button 
                        onClick={handleStart}
                        disabled={!selectedDifficulty}
                        className="w-full sm:w-auto px-16 py-5 bg-slate-200 text-olive disabled:opacity-50 disabled:cursor-not-allowed rounded-[24px] font-black text-lg transition-all hover:bg-amber hover:text-gunmetal hover:shadow-2xl shadow-amber/20 active:scale-95"
                        style={selectedDifficulty ? { backgroundColor: '#FFB627', color: '#393D3F', boxShadow: '0 20px 40px rgba(255,182,39,0.3)' } : {}}
                    >
                        Iniciar Agora
                    </button>
                </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default SelectionScreen;
