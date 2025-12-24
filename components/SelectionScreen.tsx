
import React, { useState, useMemo } from 'react';
import { Exercise, Difficulty, Recording } from '../types';
import { EXERCISES } from '../constants';

interface SelectionScreenProps {
  onStart: (exercise: Exercise, difficulty: Difficulty) => void;
  recordings: Recording[];
}

type WidgetType = 'OVERALL' | 'WEEKLY' | 'MONTHLY' | 'GOALS';

const SelectionScreen: React.FC<SelectionScreenProps> = ({ onStart, recordings }) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [showAllExercises, setShowAllExercises] = useState(false);
  
  const [widgets, setWidgets] = useState<WidgetType[]>(['OVERALL', 'WEEKLY', 'MONTHLY']);
  const [activeCustomizer, setActiveCustomizer] = useState<number | null>(null);

  const stats = useMemo(() => {
    const total = recordings.length;
    const avgScore = total > 0 ? Math.round(recordings.reduce((acc, r) => acc + r.analysis.score, 0) / total) : 0;
    const qualified = recordings.filter(r => r.analysis.isQualified).length;
    const lost = recordings.filter(r => !r.analysis.isQualified && r.transcript.length > 0).length;
    const newRecs = recordings.filter(r => {
        const d = new Date(r.date);
        const today = new Date();
        return d.toDateString() === today.toDateString();
    }).length;

    const weeklyData = [0, 0, 0, 0, 0, 0, 0];
    const today = new Date();
    recordings.forEach(r => {
        const recDate = new Date(r.date);
        const diffTime = Math.abs(today.getTime() - recDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 7) {
            const index = 6 - diffDays;
            if (index >= 0) weeklyData[index]++;
        }
    });

    return { total, avgScore, qualified, lost, newRecs, weeklyData };
  }, [recordings]);

  const handleStart = () => {
    if (selectedExercise && selectedDifficulty) {
      onStart(selectedExercise, selectedDifficulty);
    }
  };

  const renderWidget = (type: WidgetType, index: number) => {
    const header = (title: string, isDark: boolean = false) => (
        <div className="flex justify-between items-center mb-4">
            <h3 className={`text-sm font-black tracking-tight uppercase ${isDark ? 'text-ghost/80' : 'text-gunmetal/70'}`}>{title}</h3>
            <button className={`${isDark ? 'text-ghost/30' : 'text-olive/40'}`}><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/></svg></button>
        </div>
    );

    switch(type) {
        case 'OVERALL':
            return (
                <div className="card-glass p-6 min-h-[220px] flex flex-col justify-between border-white/5 shadow-xl">
                    {header('Global Stats', true)}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <p className="text-2xl font-black text-amber">{stats.total}</p>
                            <p className="text-[9px] uppercase font-bold opacity-40">Sessions</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <p className="text-2xl font-black text-ghost">{stats.avgScore}%</p>
                            <p className="text-[9px] uppercase font-bold opacity-40">Avg Score</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1 bg-white/5 p-2 rounded-lg text-center border border-white/5">
                             <p className="text-xs font-black text-emerald-400">{stats.qualified}</p>
                             <p className="text-[7px] uppercase font-bold opacity-30">Qualified</p>
                        </div>
                        <div className="flex-1 bg-white/5 p-2 rounded-lg text-center border border-white/5">
                             <p className="text-xs font-black text-ochre">{stats.lost}</p>
                             <p className="text-[7px] uppercase font-bold opacity-30">Lost</p>
                        </div>
                    </div>
                </div>
            );
        case 'WEEKLY':
            return (
                <div className="card-glass p-6 min-h-[220px] flex flex-col border-white/5 shadow-xl">
                    {header('Activity', true)}
                    <div className="flex-grow flex items-end justify-between gap-1.5 px-1">
                        {stats.weeklyData.map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full bg-white/5 rounded-t-lg h-24 relative overflow-hidden">
                                    <div 
                                        className={`absolute bottom-0 left-0 w-full transition-all duration-700 ${i === 6 ? 'bg-amber' : 'bg-olive/40'}`} 
                                        style={{ height: `${(val / Math.max(...stats.weeklyData, 1)) * 100}%` }}
                                    ></div>
                                </div>
                                <span className={`text-[7px] font-black ${i === 6 ? 'text-amber' : 'text-ghost/30'}`}>
                                    {['S','T','Q','Q','S','S','D'][(new Date().getDay() + i) % 7]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'MONTHLY':
            return (
                <div className="card-glass p-6 min-h-[220px] flex flex-col border-white/5 shadow-xl">
                    {header('Progress', true)}
                    <div className="flex-grow flex flex-col items-center justify-center">
                        <div className="text-4xl font-black text-amber leading-none">{Math.min(100, Math.round((stats.total / 20) * 100))}%</div>
                        <p className="text-[9px] font-bold text-ghost/40 uppercase tracking-widest mt-2">Monthly Target</p>
                        <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden border border-white/5">
                             <div className="h-full bg-amber shadow-[0_0_10px_rgba(255,182,39,0.3)] transition-all duration-1000" style={{ width: `${(stats.total / 20) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
            );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-up">
      {/* Dynamic Widgets Area Refined */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderWidget('OVERALL', 0)}
        {renderWidget('WEEKLY', 1)}
        {renderWidget('MONTHLY', 2)}
      </div>

      <div className="space-y-6">
        <div className="flex items-end justify-between border-b border-white/5 pb-4 px-2">
            <div>
                <h3 className="text-xl font-black text-ghost tracking-tight">Cenários Recomendados</h3>
                <p className="text-olive text-[10px] font-bold uppercase tracking-widest mt-0.5 opacity-60">Foco em Performance de Fecho</p>
            </div>
            <button onClick={() => setShowAllExercises(true)} className="text-[10px] font-black text-amber hover:opacity-80 transition-all flex items-center gap-1.5 uppercase tracking-widest">
                VER TODOS <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M9 5l7 7-7 7" /></svg>
            </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-1">
            {EXERCISES.slice(0, 4).map((exercise) => (
                <div 
                    key={exercise.id}
                    onClick={() => setSelectedExercise(exercise)}
                    className="card-white p-6 cursor-pointer hover:translate-y-[-4px] hover:shadow-2xl hover:ring-2 hover:ring-amber/30 transition-all flex flex-col justify-between min-h-[180px]"
                >
                    <div className="flex justify-between items-start">
                        <div className="w-9 h-9 bg-gunmetal/5 rounded-xl flex items-center justify-center text-gunmetal/60">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7" /></svg>
                        </div>
                        <span className="text-[8px] font-black bg-gunmetal/5 text-gunmetal/40 px-2 py-1 rounded-lg">NEW</span>
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-gunmetal leading-tight">{exercise.title}</h4>
                        <p className="text-[10px] text-olive/60 mt-1 font-bold">10-15 Minutos</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {selectedExercise && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-gunmetal/80 backdrop-blur-xl animate-fade-in" onClick={() => setSelectedExercise(null)}></div>
             
             <div className="card-white w-full max-w-sm p-8 shadow-2xl animate-fade-up relative z-10 overflow-hidden border-b-4 border-amber">
                <div className="text-center mb-8">
                    <h3 className="text-xl font-black text-gunmetal tracking-tight mb-1">Nível de Dificuldade</h3>
                    <p className="text-olive font-bold uppercase tracking-[0.2em] text-[9px] opacity-60">Personalize o comportamento da IA</p>
                </div>
                
                <div className="space-y-2 mb-8">
                    {Object.values(Difficulty).map((diff) => (
                        <button
                            key={diff}
                            onClick={() => setSelectedDifficulty(diff)}
                            className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between ${selectedDifficulty === diff ? 'bg-gunmetal text-amber border-gunmetal shadow-lg' : 'bg-white border-slate-100 text-gunmetal hover:border-amber/30'}`}
                        >
                            <span className="font-black text-xs uppercase tracking-widest">{diff}</span>
                            <div className={`w-4 h-4 rounded-full border-2 ${selectedDifficulty === diff ? 'border-amber bg-amber' : 'border-slate-200'}`}></div>
                        </button>
                    ))}
                </div>

                <div className="flex gap-3">
                    <button onClick={() => setSelectedExercise(null)} className="flex-1 py-3 text-[10px] font-black text-olive hover:text-gunmetal transition-colors">CANCELAR</button>
                    <button 
                        onClick={handleStart}
                        disabled={!selectedDifficulty}
                        className="flex-[2] py-3 bg-amber text-gunmetal rounded-xl font-black text-xs tracking-widest disabled:opacity-50 hover:brightness-105 active:scale-95 transition-all shadow-lg"
                    >
                        COMEÇAR CALL
                    </button>
                </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default SelectionScreen;
