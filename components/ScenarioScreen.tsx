
import React from 'react';
import { ScenarioData } from '../types';

interface ScenarioScreenProps {
  scenarioData: ScenarioData;
  onStartCall: () => void;
  onBack: () => void;
}

const InfoCard: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col justify-center">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">{label}</p>
            <p className="text-base font-bold text-white">{value}</p>
        </div>
    );
}

const ScenarioScreen: React.FC<ScenarioScreenProps> = ({ scenarioData, onStartCall, onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
      <header className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
            <button onClick={onBack} className="text-slate-400 hover:text-white mb-4 flex items-center gap-2 text-sm font-semibold transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar à seleção
            </button>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Análise do Lead</h1>
        </div>
        <button
          onClick={onStartCall}
          className="bg-teal-500 text-white font-bold py-4 px-10 rounded-2xl text-lg transition-all duration-300 hover:bg-teal-400 shadow-xl shadow-teal-500/20 active:scale-95 whitespace-nowrap"
        >
          Iniciar Roleplay
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10 flex flex-col items-center text-center">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-teal-500 blur-2xl opacity-20 rounded-full"></div>
                    <img src={scenarioData.avatarUrl} alt={scenarioData.name} className="relative w-32 h-32 rounded-full border-4 border-white/10 shadow-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{scenarioData.name}</h2>
                <div className="px-4 py-1.5 bg-white/10 rounded-full text-xs font-bold text-teal-400 border border-white/10">
                    {scenarioData.brand}
                </div>
            </div>

            <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-teal-500 rounded-full"></span>
                    Ficha Técnica
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <InfoCard label="Exp." value={scenarioData.experience} />
                    <InfoCard label="Faturação" value={scenarioData.revenue} />
                    <InfoCard label="Angariações" value={scenarioData.propertiesAcquired} />
                    <InfoCard label="Adoção Digital" value={scenarioData.digitalAdoption} />
                </div>
            </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10 h-full">
                <div className="space-y-8">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-3">Contexto da Abordagem</h3>
                        <p className="text-slate-400 leading-relaxed text-lg">
                            {scenarioData.context}
                        </p>
                    </div>

                    {scenarioData.dreamOrFear && (
                        <div className="bg-teal-500/10 rounded-2xl p-6 border border-teal-500/20">
                            <h3 className="text-sm font-bold text-teal-400 uppercase tracking-widest mb-2">Indicador Psicológico</h3>
                            <p className="text-white font-medium italic text-lg">"{scenarioData.dreamOrFear}"</p>
                        </div>
                    )}

                    <div className="pt-6 border-t border-white/5">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Dica do Coach</h4>
                        <ul className="space-y-3">
                            {[
                                "Crie rapport nos primeiros 30 segundos.",
                                "Valide os problemas que o lead mencionar.",
                                "Use a informação de faturação para justificar o ROI."
                            ].map((tip, i) => (
                                <li key={i} className="flex items-start gap-3 text-slate-400 text-sm">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0"></div>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioScreen;
