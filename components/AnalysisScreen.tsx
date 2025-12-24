
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
    const circumference = 2 * Math.PI * 65;
    const offset = circumference - (score / 100) * circumference;
    const strokeColor = score >= 75 ? 'text-amber' : score >= 50 ? 'text-ochre' : 'text-red-500';

    return (
      <div className="relative w-56 h-56">
        <svg className="w-full h-full" viewBox="0 0 150 150">
          <circle
            className="text-white/5"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="65"
            cx="75"
            cy="75"
          />
          <circle
            className={`${strokeColor} transition-all duration-1000 ease-out drop-shadow-[0_0_15px_rgba(255,182,39,0.4)]`}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="65"
            cx="75"
            cy="75"
            transform="rotate(-90 75 75)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-black text-ghost leading-none mb-1">{score}</span>
            <span className="text-[10px] font-black text-olive uppercase tracking-[0.2em]">Score IA</span>
        </div>
      </div>
    );
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-10 p-16 bg-white/5 rounded-[40px] border border-white/10 w-full max-w-xl mx-auto animate-pulse">
            <div className="relative">
                <div className="w-24 h-24 border-8 border-amber/10 rounded-full"></div>
                <div className="absolute inset-0 w-24 h-24 border-8 border-t-amber rounded-full animate-spin"></div>
            </div>
            <div className="text-center">
                <h3 className="text-ghost text-2xl font-black mb-3">O Coach Diogo está a analisar...</h3>
                <p className="text-olive text-sm font-bold uppercase tracking-widest leading-relaxed">Processando transcrição e áudio para gerar feedback tático.</p>
            </div>
        </div>
      );
    }

    if (error) {
        return (
            <div className="text-center bg-ochre/10 border border-ochre/20 p-10 rounded-[40px] max-w-xl mx-auto animate-fade-up">
                <div className="w-16 h-16 bg-ochre text-ghost rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 className="text-2xl font-black text-ghost mb-3 uppercase tracking-tight">Falha na Análise</h3>
                <p className="text-olive font-bold mb-10 text-sm leading-relaxed">{error}</p>
                <button onClick={onTryAgain} className="w-full bg-ochre text-ghost font-black py-5 rounded-2xl hover:bg-amber transition-all uppercase tracking-widest shadow-xl">Tentar Novamente</button>
            </div>
        )
    }

    if (analysisResult) {
      return (
        <div className="space-y-10 animate-fade-up w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Resumo do Score */}
            <div className="lg:col-span-4 card-glass rounded-[40px] p-10 flex flex-col items-center text-center">
              <ScoreCircle score={analysisResult.score} />
              <div className="mt-10 space-y-6 w-full">
                  <div className={`p-6 rounded-[32px] border transition-all ${analysisResult.isQualified ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-ochre/10 border-ochre/30'}`}>
                      <p className="text-[9px] uppercase font-black text-olive tracking-[0.2em] mb-2">Conclusão da Call</p>
                      <p className={`text-2xl font-black ${analysisResult.isQualified ? 'text-emerald-400' : 'text-ochre'}`}>
                          {analysisResult.isQualified ? 'LEAD QUALIFICADO' : 'LEAD PERDIDO'}
                      </p>
                  </div>
                  <button
                    onClick={onTryAgain}
                    className="w-full bg-amber text-gunmetal font-black py-6 rounded-3xl transition-all shadow-[0_20px_40px_rgba(255,182,39,0.2)] hover:translate-y-[-4px] active:scale-95 uppercase tracking-widest text-lg"
                  >
                    Novo Roleplay
                  </button>
              </div>
            </div>
            
            {/* Detalhes do Feedback */}
            <div className="lg:col-span-8 space-y-6">
                <div className="card-glass rounded-[40px] p-10 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-amber"></div>
                    <h4 className="text-[10px] font-black text-amber uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                        <span className="w-1.5 h-3 bg-amber rounded-full"></span>
                        Diagnóstico Tático
                    </h4>
                    <p className="text-ghost/90 text-2xl font-black tracking-tight leading-snug italic">"{analysisResult.summary}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-ochre/5 rounded-[32px] p-10 border border-ochre/10 relative group hover:bg-ochre/[0.08] transition-colors">
                        <div className="absolute top-6 right-8 text-ochre/20"><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg></div>
                        <h4 className="text-[9px] font-black text-ochre uppercase tracking-[0.3em] mb-8">Pontos Críticos</h4>
                        <ul className="space-y-6">
                            {analysisResult.failedPoints.map((point, i) => (
                                <li key={i} className="flex items-start gap-4 text-ghost/70 text-sm font-bold leading-relaxed">
                                    <span className="mt-1 w-2 h-2 rounded-full bg-ochre flex-shrink-0"></span>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-amber/5 rounded-[32px] p-10 border border-amber/10 relative group hover:bg-amber/[0.08] transition-colors">
                        <div className="absolute top-6 right-8 text-amber/20"><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42A6.92 6.92 0 0119 12c0 3.87-3.13 7-7 7s-7-3.13-7-7a6.92 6.92 0 012.59-5.41L6.17 5.17A8.95 8.95 0 003 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-3.12-1.59-5.87-4-7.48V3h-2v2.17z"/></svg></div>
                        <h4 className="text-[9px] font-black text-amber uppercase tracking-[0.3em] mb-8">Melhoria para Próxima Call</h4>
                        <ul className="space-y-6">
                            {analysisResult.nextSteps.map((step, i) => (
                                <li key={i} className="flex items-start gap-4 text-ghost/70 text-sm font-bold leading-relaxed">
                                    <span className="mt-1 w-2 h-2 rounded-full bg-amber flex-shrink-0"></span>
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
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
      <header className="mb-14 border-b border-white/5 pb-10">
        <span className="text-amber font-black tracking-[0.4em] text-[10px] uppercase mb-3 block opacity-60">Resultados Oficiais Diogo Coach</span>
        <h2 className="text-6xl font-black text-ghost tracking-tighter leading-none">Análise da Performance</h2>
      </header>
      <div className="min-h-[400px]">{renderContent()}</div>
    </div>
  );
};

export default AnalysisScreen;
