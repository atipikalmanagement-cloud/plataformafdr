
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

const AnalysisScreen: React.FC<AnalysisScreenProps> = ({ analysisResult, isLoading, error, onTryAgain }) => {
  
  const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;
    const strokeColor = score >= 75 ? 'text-amber' : score >= 50 ? 'text-ochre' : 'text-red-500';

    return (
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 110 110">
          <circle className="text-white/5" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="55" cy="55" />
          <circle
            className={`${strokeColor} transition-all duration-1000 ease-out`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="55"
            cy="55"
            transform="rotate(-90 55 55)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-ghost leading-none">{score}</span>
            <span className="text-[7px] font-black text-olive uppercase tracking-widest">Score</span>
        </div>
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 p-12 card-glass max-w-sm mx-auto animate-pulse">
          <div className="w-12 h-12 border-4 border-amber/10 border-t-amber rounded-full animate-spin"></div>
          <p className="text-ghost text-sm font-black text-center">Gerando feedback tático...</p>
      </div>
    );
  }

  if (analysisResult) {
    return (
      <div className="space-y-6 animate-fade-up w-full max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 card-glass p-8 flex flex-col items-center text-center">
            <ScoreCircle score={analysisResult.score} />
            <div className="mt-8 space-y-4 w-full">
                <div className={`p-4 rounded-2xl border ${analysisResult.isQualified ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-ochre/5 border-ochre/20'}`}>
                    <p className={`text-sm font-black ${analysisResult.isQualified ? 'text-emerald-400' : 'text-ochre'}`}>
                        {analysisResult.isQualified ? 'QUALIFICADO' : 'PERDIDO'}
                    </p>
                </div>
                <button onClick={onTryAgain} className="w-full bg-amber text-gunmetal font-black py-4 rounded-2xl transition-all shadow-lg text-xs tracking-widest uppercase">Novo Roleplay</button>
            </div>
          </div>
          
          <div className="lg:col-span-8 space-y-4">
              <div className="card-glass p-8 border-l-4 border-l-amber">
                  <h4 className="text-[9px] font-black text-amber uppercase tracking-widest mb-4">Sumário Diogo Coach</h4>
                  <p className="text-ghost/90 text-lg font-bold tracking-tight leading-snug">"{analysisResult.summary}"</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-ochre/5 rounded-2xl p-6 border border-ochre/10">
                      <h4 className="text-[8px] font-black text-ochre uppercase tracking-widest mb-4">Pontos de Atenção</h4>
                      <ul className="space-y-3">
                          {analysisResult.failedPoints.slice(0, 3).map((point, i) => (
                              <li key={i} className="flex items-start gap-2 text-ghost/70 text-[11px] font-bold">
                                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-ochre flex-shrink-0"></span>
                                  {point}
                              </li>
                          ))}
                      </ul>
                  </div>

                  <div className="bg-amber/5 rounded-2xl p-6 border border-amber/10">
                      <h4 className="text-[8px] font-black text-amber uppercase tracking-widest mb-4">Próximos Passos</h4>
                      <ul className="space-y-3">
                          {analysisResult.nextSteps.slice(0, 3).map((step, i) => (
                              <li key={i} className="flex items-start gap-2 text-ghost/70 text-[11px] font-bold">
                                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber flex-shrink-0"></span>
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

export default AnalysisScreen;
