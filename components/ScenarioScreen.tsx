
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
        <div className="bg-white/5 p-5 rounded-3xl border border-white/5 flex items-center gap-4 group hover:bg-white/[0.08] transition-colors">
            {icon && <div className="text-amber opacity-60 group-hover:opacity-100 transition-opacity">{icon}</div>}
            <div>
                <p className="text-[9px] uppercase tracking-[0.2em] font-black text-olive mb-0.5">{label}</p>
                <p className="text-lg font-black text-ghost tracking-tight leading-none">{value}</p>
            </div>
        </div>
    );
}

const ScenarioScreen: React.FC<ScenarioScreenProps> = ({ scenarioData, onStartCall, onBack }) => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 animate-fade-up">
      <header className="mb-14 flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/10 pb-10">
        <div className="text-left w-full md:w-auto">
            <button onClick={onBack} className="text-amber hover:text-ghost mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors group">
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar à seleção
            </button>
            <h1 className="text-6xl font-black text-ghost tracking-tighter leading-none mb-2">Dossiê do Lead</h1>
            <p className="text-olive font-bold uppercase tracking-widest text-xs">Analise os dados antes de ligar</p>
        </div>
        <button
          onClick={onStartCall}
          className="w-full md:w-auto bg-amber text-gunmetal font-black py-6 px-14 rounded-3xl text-xl transition-all duration-300 hover:bg-ochre hover:text-ghost shadow-[0_20px_50px_rgba(255,182,39,0.3)] active:scale-95 whitespace-nowrap uppercase tracking-widest"
        >
          Ligar Agora
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Lado Esquerdo - Perfil Social */}
        <div className="lg:col-span-4 space-y-8">
            <div className="card-glass rounded-[40px] p-10 flex flex-col items-center text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-amber opacity-30"></div>
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-amber blur-[60px] opacity-20 rounded-full group-hover:opacity-40 transition-opacity"></div>
                    <img src={scenarioData.avatarUrl} alt={scenarioData.name} className="relative w-40 h-40 rounded-full border-4 border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-105" />
                </div>
                <h2 className="text-3xl font-black text-ghost mb-2 tracking-tight leading-tight">{scenarioData.name}</h2>
                <div className="px-5 py-2 bg-white/10 rounded-2xl text-[10px] font-black text-amber border border-white/10 uppercase tracking-[0.2em]">
                    {scenarioData.brand}
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-[10px] font-black text-olive uppercase tracking-[0.3em] mb-4 flex items-center gap-3 px-4">
                    <span className="w-1 h-3 bg-ochre rounded-full"></span>
                    Dados Financeiros
                </h3>
                <div className="grid grid-cols-1 gap-3">
                    <InfoCard label="Experiência" value={scenarioData.experience} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                    <InfoCard label="Faturação Anual" value={scenarioData.revenue} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                    <InfoCard label="Volume Vendas" value={scenarioData.propertiesAcquired} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
                </div>
            </div>
        </div>

        {/* Lado Direito - Estratégia */}
        <div className="lg:col-span-8 space-y-8">
            <div className="card-glass rounded-[40px] p-10 md:p-14 h-full relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-amber blur-[120px] opacity-5 pointer-events-none"></div>
                
                <div className="space-y-12 relative z-10">
                    <div>
                        <h3 className="text-[10px] font-black text-amber uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                            <span className="w-1 h-3 bg-amber rounded-full"></span>
                            Contexto do Lead
                        </h3>
                        <p className="text-ghost/80 leading-relaxed text-2xl font-bold tracking-tight">
                            {scenarioData.context}
                        </p>
                    </div>

                    {scenarioData.dreamOrFear && (
                        <div className="bg-amber/10 rounded-[32px] p-8 border border-amber/20 relative group">
                            <div className="absolute -top-3 left-8 px-4 py-1 bg-amber rounded-full text-[8px] font-black text-gunmetal uppercase tracking-widest">Gatilho Psicológico</div>
                            <p className="text-ghost font-black italic text-xl leading-snug">"{scenarioData.dreamOrFear}"</p>
                        </div>
                    )}

                    <div className="pt-10 border-t border-white/5">
                        <h4 className="text-[10px] font-black text-olive uppercase tracking-[0.3em] mb-8">Dicas Estratégicas do Diogo</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                "Foque no rapport emocional nos primeiros 20 seg.",
                                "Valide os problemas técnicos do lead.",
                                "Use a faturação para provar o retorno (ROI).",
                                "Não tenha medo de confrontar objeções de preço."
                            ].map((tip, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-amber/20 transition-colors">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-ochre/20 flex items-center justify-center text-ochre font-black text-[10px]">{i+1}</div>
                                    <p className="text-ghost/60 text-xs font-bold leading-relaxed">{tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioScreen;
