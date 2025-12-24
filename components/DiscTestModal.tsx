
import React, { useState } from 'react';
import { DiscProfile, DiscType } from '../types';

interface DiscTestModalProps {
    onComplete: (profile: DiscProfile) => void;
}

const QUESTIONS = [
    {
        q: "Quando entra numa primeira chamada com um lead, qual é o seu foco principal?",
        options: [
            { text: "Chegar ao ponto o mais rápido possível e marcar a reunião.", type: 'D' as DiscType },
            { text: "Criar uma ligação e deixar o cliente à vontade com humor.", type: 'I' as DiscType },
            { text: "Ouvir pacientemente e transmitir segurança e confiança.", type: 'S' as DiscType },
            { text: "Seguir o meu guião e anotar todos os dados técnicos.", type: 'C' as DiscType }
        ]
    },
    {
        q: "Como reage perante um lead muito agressivo ou cético?",
        options: [
            { text: "Mantenho a minha posição e respondo com autoridade.", type: 'D' as DiscType },
            { text: "Tento desarmá-lo com simpatia e boa energia.", type: 'I' as DiscType },
            { text: "Mantenho a calma e tento compreender a origem da dúvida.", type: 'S' as DiscType },
            { text: "Apresento factos e provas lógicas para rebater o ceticismo.", type: 'C' as DiscType }
        ]
    },
    {
        q: "Ao apresentar uma proposta, você prefere...",
        options: [
            { text: "Falar dos ganhos financeiros e do ROI imediato.", type: 'D' as DiscType },
            { text: "Contar histórias de sucesso de outros clientes.", type: 'I' as DiscType },
            { text: "Explicar como o processo será seguro e sem riscos.", type: 'S' as DiscType },
            { text: "Detalhar cada etapa técnica e os pormenores do contrato.", type: 'C' as DiscType }
        ]
    },
    {
        q: "Qual é a sua maior força em vendas?",
        options: [
            { text: "O meu poder de fecho e insistência.", type: 'D' as DiscType },
            { text: "A minha capacidade de persuasão e carisma.", type: 'I' as DiscType },
            { text: "A minha lealdade e o serviço ao cliente.", type: 'S' as DiscType },
            { text: "A minha organização e precisão na informação.", type: 'C' as DiscType }
        ]
    },
    {
        q: "O que mais o irrita durante uma negociação?",
        options: [
            { text: "Pessoas que demoram muito tempo a decidir.", type: 'D' as DiscType },
            { text: "Pessoas que são muito frias e sem emoção.", type: 'I' as DiscType },
            { text: "Conflitos desnecessários ou falta de educação.", type: 'S' as DiscType },
            { text: "Falta de lógica ou erros nos dados apresentados.", type: 'C' as DiscType }
        ]
    },
    {
        q: "Como organiza o seu dia de prospecção?",
        options: [
            { text: "Ataco os leads mais difíceis primeiro para ganhar o dia.", type: 'D' as DiscType },
            { text: "Vou fazendo as chamadas conforme a minha energia.", type: 'I' as DiscType },
            { text: "Sigo uma rotina consistente e previsível.", type: 'S' as DiscType },
            { text: "Tenho um CRM impecável com lembretes para tudo.", type: 'C' as DiscType }
        ]
    },
    {
        q: "Numa reunião de equipa, você é a pessoa que...",
        options: [
            { text: "Diz o que tem de ser feito para atingir as metas.", type: 'D' as DiscType },
            { text: "Anima o grupo e traz novas ideias criativas.", type: 'I' as DiscType },
            { text: "Ouve todos e ajuda a manter a paz no grupo.", type: 'S' as DiscType },
            { text: "Analisa o que correu mal e propõe melhorias baseadas em factos.", type: 'C' as DiscType }
        ]
    },
    {
        q: "Quando um cliente diz 'É muito caro', a sua resposta inicial é:",
        options: [
            { text: "'Comparado com o quê?' - Desafio direto.", type: 'D' as DiscType },
            { text: "'Pense no valor que isto vai trazer à sua vida!'", type: 'I' as DiscType },
            { text: "'Eu percebo, vamos ver como podemos ajustar para si.'", type: 'S' as DiscType },
            { text: "'Deixe-me mostrar-lhe o detalhe de onde vem o investimento.'", type: 'C' as DiscType }
        ]
    },
    {
        q: "Qual o seu maior medo profissional?",
        options: [
            { text: "Perder o controlo ou fracassar perante a concorrência.", type: 'D' as DiscType },
            { text: "Ser rejeitado ou não ser admirado pelos outros.", type: 'I' as DiscType },
            { text: "Mudanças repentinas que tragam instabilidade.", type: 'S' as DiscType },
            { text: "Cometer erros ou ser criticado por falta de rigor.", type: 'C' as DiscType }
        ]
    },
    {
        q: "Para si, o sucesso nas vendas define-se por:",
        options: [
            { text: "Ser o número 1 no ranking de faturação.", type: 'D' as DiscType },
            { text: "Ter uma rede imensa de contactos que gostam de mim.", type: 'I' as DiscType },
            { text: "Ter clientes satisfeitos que me recomendam há anos.", type: 'S' as DiscType },
            { text: "Cumprir todos os processos com excelência e qualidade.", type: 'C' as DiscType }
        ]
    }
];

const DISC_INFO: Record<DiscType, { label: string, desc: string, strategy: string }> = {
    'D': { 
        label: "Dominante", 
        desc: "Você é direto, focado em resultados e prefere rapidez. Gosta de controlar a conversa.",
        strategy: "Para o desafiar, os nossos agentes de IA serão mais 'Estáveis' (S) - lentos a decidir, indecisos e focados em emoções, forçando-o a trabalhar a paciência."
    },
    'I': { 
        label: "Influente", 
        desc: "Você é comunicativo, entusiasta e focado em pessoas. Usa o carisma para vender.",
        strategy: "Para o desafiar, os nossos agentes serão mais 'Conformes' (C) - frios, monossilábicos e obcecados por dados técnicos, forçando-o a sair do rapport emocional."
    },
    'S': { 
        label: "Estável", 
        desc: "Você é paciente, bom ouvinte e focado na harmonia. Transmite segurança.",
        strategy: "Para o desafiar, os nossos agentes serão mais 'Dominantes' (D) - impacientes, agressivos e autoritários, forçando-o a ser mais assertivo e rápido."
    },
    'C': { 
        label: "Conforme", 
        desc: "Você é analítico, preciso e focado na qualidade e nos factos.",
        strategy: "Para o desafiar, os nossos agentes serão mais 'Influentes' (I) - desorganizados, emocionais e baseados em 'gut feeling', forçando-o a vender além dos dados técnicos."
    }
};

const DiscTestModal: React.FC<DiscTestModalProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<DiscType[]>([]);
    const [result, setResult] = useState<DiscProfile | null>(null);

    const handleAnswer = (type: DiscType) => {
        const newAnswers = [...answers, type];
        setAnswers(newAnswers);
        
        if (step < QUESTIONS.length - 1) {
            setStep(step + 1);
        } else {
            calculateResult(newAnswers);
        }
    };

    const calculateResult = (finalAnswers: DiscType[]) => {
        const counts = finalAnswers.reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
        }, {} as Record<DiscType, number>);

        let maxType: DiscType = 'D';
        let maxCount = 0;
        
        (['D', 'I', 'S', 'C'] as DiscType[]).forEach(t => {
            if ((counts[t] || 0) > maxCount) {
                maxCount = counts[t] || 0;
                maxType = t;
            }
        });

        const info = DISC_INFO[maxType];
        setResult({
            type: maxType,
            label: info.label,
            description: info.desc,
            challengeStrategy: info.strategy
        });
    };

    if (result) {
        return (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-gunmetal p-4 animate-fade-in">
                <div className="card-white w-full max-w-2xl p-10 md:p-14 text-center shadow-[0_60px_150px_rgba(0,0,0,0.8)] border-t-[12px] border-amber">
                    <div className="w-20 h-20 bg-amber/20 rounded-full flex items-center justify-center mx-auto mb-8">
                         <span className="text-4xl font-black text-gunmetal">{result.type}</span>
                    </div>
                    <h2 className="text-4xl font-black text-gunmetal mb-4">Perfil: {result.label}</h2>
                    <p className="text-olive font-medium text-lg mb-8 leading-relaxed">{result.description}</p>
                    
                    <div className="bg-slate-50 p-8 rounded-3xl mb-10 border border-olive/10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-ochre mb-3">Treino Adaptativo Ativado</h4>
                        <p className="text-gunmetal font-bold text-sm leading-relaxed">{result.challengeStrategy}</p>
                    </div>

                    <button 
                        onClick={() => onComplete(result)}
                        className="w-full bg-gunmetal text-amber font-black py-5 rounded-2xl hover:bg-ochre hover:text-ghost transition-all shadow-2xl"
                    >
                        COMEÇAR O MEU TREINO
                    </button>
                </div>
            </div>
        );
    }

    const progress = Math.round(((step + 1) / QUESTIONS.length) * 100);

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-gunmetal p-4 animate-fade-in overflow-y-auto">
            <div className="card-white w-full max-w-2xl p-8 md:p-12 shadow-[0_60px_150px_rgba(0,0,0,0.8)] relative my-8">
                <div className="absolute top-0 left-0 h-1.5 bg-slate-100 w-full rounded-t-3xl overflow-hidden">
                    <div className="h-full bg-amber transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="mb-10 text-center">
                    <p className="text-[10px] font-black text-olive uppercase tracking-[0.3em] mb-2">Desafio de Perfil Comportamental</p>
                    <h2 className="text-2xl font-black text-gunmetal">Pergunta {step + 1} de {QUESTIONS.length}</h2>
                </div>

                <h3 className="text-xl font-bold text-gunmetal mb-10 text-center leading-tight">
                    {QUESTIONS[step].q}
                </h3>

                <div className="space-y-4">
                    {QUESTIONS[step].options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => handleAnswer(opt.type)}
                            className="w-full text-left p-6 rounded-2xl border-2 border-slate-100 hover:border-amber hover:bg-slate-50 transition-all flex items-center gap-4 group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-xs text-olive group-hover:bg-amber group-hover:text-gunmetal">
                                {String.fromCharCode(65 + i)}
                            </div>
                            <span className="font-bold text-gunmetal text-sm md:text-base">{opt.text}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DiscTestModal;
