
import React from 'react';
import { AnalysisResult, Transcript } from '../types';

interface AnalysisScreenProps {
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  onTryAgain: () => void;
  transcript: Transcript[] | null;
  userAudioUrl: string | null;
  aiAudioUrl: string | null;
}

const AnalysisScreen: React.FC<AnalysisScreenProps> = ({ analysisResult, isLoading, error, onTryAgain, transcript, userAudioUrl, aiAudioUrl }) => {
  
  const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
    const circumference = 2 * Math.PI * 55;
    const offset = circumference - (score / 100) * circumference;
    const strokeColor = score >= 75 ? 'text-amber' : score >= 50 ? 'text-ochre' : 'text-red-500';

    return (
      <div className="relative w-48 h-48">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle
            className="text-ghost/5"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="55"
            cx="60"
            cy="60"
          />
          <circle
            className={`${strokeColor} transition-all duration-1000 ease-out drop-shadow-[0_0_10px_rgba(255,182,39,0.3)]`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="55"
            cx="60"
            cy="60"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-ghost">{score}</span>
            <span className="text-[10px] font-bold text-olive uppercase tracking-widest">Score Final</span>
        </div>
      </div>
    );
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-8 p-12 bg-ghost/5 rounded-3xl border border-ghost/10 w-full max-w-lg mx-auto">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-amber/20 rounded-full"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-t-amber rounded-full animate-spin"></div>
            </div>
            <div className="text-center">
                <p className="text-ghost text-xl font-bold mb-2">Processando a chamada...</p>
                <p className="text-olive text-sm">O Coach Diogo está a analisar a sua performance para gerar o feedback detalhado.</p>
            </div>
        </div>
      );
    }

    if (error) {
        return (
            <div className="text-center bg-ochre/10 border border-ochre/20 p-8 rounded-3xl max-w-lg mx-auto">
                <h3 className="text-xl font-bold text-ghost mb-2">Erro na Análise</h3>
                <p className="text-olive mb-6">{error}</p>
                <button onClick={onTryAgain} className="bg-ochre text-ghost font-bold py-3 px-8 rounded-xl hover:bg-amber transition-all">Tentar Novamente</button>
            </div>
        )
    }

    if (analysisResult) {
      return (
        <div className="space-y-8 animate-fade-in w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-ghost/5 rounded-3xl p-8 border border-ghost/10 flex flex-col items-center text-center">
              <ScoreCircle score={analysisResult.score} />
              <div className="mt-8 space-y-6 w-full">
                  <div className="p-4 bg-ghost/5 rounded-2xl border border-amber/10">
                      <p className="text-[10px] uppercase font-bold text-olive tracking-widest mb-1 text-center">Status</p>
                      <p className={`text-xl font-black text-center ${analysisResult.isQualified ? 'text-amber' : 'text-ochre'}`}>
                          {analysisResult.isQualified ? 'LEAD QUALIFICADO' : 'LEAD PERDIDO'}
                      </p>
                  </div>
                  <button
                    onClick={onTryAgain}
                    className="w-full bg-amber text-gunmetal font-bold py-4 rounded-2xl transition-all shadow-xl hover:bg-ochre hover:text-ghost active:scale-95"
                  >
                    Novo Roleplay
                  </button>
              </div>
            </div>
            
            <div className="lg:col-span-8 space-y-6">
                <div className="bg-ghost/5 rounded-3xl p-8 border border-ghost/10">
                    <h4 className="text-xl font-bold text-ghost mb-4 flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-amber rounded-full"></span>
                        Resumo da Performance
                    </h4>
                    <p className="text-olive leading-relaxed italic">"{analysisResult.summary}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-ochre/10 rounded-3xl p-8 border border-ochre/20">
                        <h4 className="text-lg font-bold text-ochre mb-6 flex items-center gap-3">Pontos de Falha</h4>
                        <ul className="space-y-4">
                            {analysisResult.failedPoints.map((point, i) => (
                                <li key={i} className="flex items-start gap-3 text-ghost text-sm leading-relaxed">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ochre flex-shrink-0"></span>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-amber/10 rounded-3xl p-8 border border-amber/20">
                        <h4 className="text-lg font-bold text-amber mb-6 flex items-center gap-3">Próximos Passos</h4>
                        <ul className="space-y-4">
                            {analysisResult.nextSteps.map((step, i) => (
                                <li key={i} className="flex items-start gap-3 text-ghost text-sm leading-relaxed">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber flex-shrink-0"></span>
                                    {step}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
      <header className="mb-12">
        <span className="text-amber font-bold tracking-[0.3em] text-xs uppercase mb-2 block">Relatório de Performance</span>
        <h2 className="text-4xl font-extrabold text-ghost tracking-tight">Análise da Chamada</h2>
      </header>
      <div className="min-h-[400px]">{renderContent()}</div>
    </div>
  );
};

export default AnalysisScreen;
