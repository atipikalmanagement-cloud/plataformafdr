
import React from 'react';
import { ScenarioData } from '../types';

interface ScenarioScreenProps {
  scenarioData: ScenarioData;
  onStartCall: () => void;
  onBack: () => void;
}

const InfoCard: React.FC<{ label: string; value: string | undefined; icon?: React.ReactNode }> = ({ label, value, icon }) => {
    if (!value) return null;
    return (
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
            <div className="text-amber opacity-50">{icon}</div>
            <div>
                <p className="text-[8px] uppercase tracking-widest font-black text-olive mb-0.5">{label}</p>
                <p className="text-sm font-black text-ghost leading-none">{value}</p>
            </div>
        </div>
    );
}

const ScenarioScreen: React.FC<ScenarioScreenProps> = ({ scenarioData, onStartCall, onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-fade-up">
      <header className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
            <button onClick={onBack} className="text-amber hover:opacity-70 mb-4 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest transition-all">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                VOLTAR
            </button>
            <h1 className="text-3xl font-black text-ghost tracking-tighter mb-1">Dossier do Lead</h1>
            <p className="text-olive font-bold text-[10px] uppercase tracking-widest">Analise estratégica pré-call</p>
        </div>
        <button
          onClick={onStartCall}
          className="w-full md:w-auto bg-amber text-gunmetal font-black py-4 px-10 rounded-2xl text-base transition-all hover:scale-[1.02] shadow-xl active:scale-95 tracking-widest uppercase"
        >
          LIGAR AGORA
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
            <div className="card-glass p-8 flex flex-col items-center text-center">
                <img src={scenarioData.avatarUrl} alt={scenarioData.name} className="w-24 h-24 rounded-full border-2 border-amber/30 mb-6 shadow-xl" />
                <h2 className="text-xl font-black text-ghost mb-1 tracking-tight">{scenarioData.name}</h2>
                <div className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black text-amber border border-white/10 uppercase tracking-widest">
                    {scenarioData.brand}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
                <InfoCard label="Experiência" value={scenarioData.experience} icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <InfoCard label="Faturação" value={scenarioData.revenue} icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" /></svg>} />
                <InfoCard label="Vendas" value={scenarioData.propertiesAcquired} icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" /></svg>} />
            </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
            <div className="card-glass p-8 md:p-10 h-full relative overflow-hidden">
                <div className="space-y-8">
                    <div>
                        <h3 className="text-[9px] font-black text-amber uppercase tracking-widest mb-4 opacity-60">Contexto</h3>
                        <p className="text-ghost/90 leading-snug text-xl font-bold tracking-tight">
                            {scenarioData.context}
                        </p>
                    </div>

                    {scenarioData.dreamOrFear && (
                        <div className="bg-amber/5 p-6 rounded-2xl border border-amber/10">
                            <p className="text-[8px] font-black text-amber/40 uppercase mb-2">Ponto de Dor / Desejo</p>
                            <p className="text-ghost font-black italic text-base leading-tight">"{scenarioData.dreamOrFear}"</p>
                        </div>
                    )}

                    <div className="pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {["Foque no rapport emocional.", "Valide problemas técnicos.", "Prove o ROI.", "Confronte objeções."].map((tip, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="w-5 h-5 rounded-lg bg-ochre/20 flex items-center justify-center text-ochre font-black text-[10px]">{i+1}</div>
                                <p className="text-ghost/60 text-[11px] font-bold">{tip}</p>
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

export default ScenarioScreen;
