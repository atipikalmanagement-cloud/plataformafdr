
import { Exercise, ExerciseType, Difficulty, ScenarioData, Transcript, User, DiscType } from './types';

export const EXERCISES: Exercise[] = [
  {
    id: 'qualify',
    type: ExerciseType.QUALIFY,
    title: 'Chamada de Qualificação',
    description: 'O lead preencheu um formulário no Facebook. Qualifique-o e agende uma reunião.',
  },
  {
    id: 'cold_qualify',
    type: ExerciseType.COLD_QUALIFY,
    title: 'Chamada Fria de Qualificação',
    description: 'O lead nunca ouviu falar de si. Capte a atenção, qualifique e agende uma reunião.',
  },
  {
    id: 'emotion',
    type: ExerciseType.EMOTION,
    title: 'Reunião: Emocional',
    description: 'Já tem uma reunião agendada. Crie rapport e descubra os sonhos e medos do lead.',
  },
  {
    id: 'proposal',
    type: ExerciseType.PROPOSAL,
    title: 'Reunião: Apresentação de Proposta',
    description: 'Apresente a sua proposta, ligando-a diretamente aos sonhos ou medos do lead.',
  },
  {
    id: 'objections',
    type: ExerciseType.OBJECTIONS,
    title: 'Reunião: Gestão de Objeções',
    description: 'O lead tem dúvidas sobre a proposta. Ultrapasse as objeções com confiança.',
  },
];

const MALE_NAMES = ['João Silva', 'Pedro Martins', 'Miguel Pereira', 'Rui Almeida', 'Tiago Santos'];
const FEMALE_NAMES = ['Ana Costa', 'Sofia Alves', 'Catarina Santos', 'Mariana Ferreira', 'Inês Rodrigues'];
const BRANDS = ['RE/MAX Vantagem', 'Century 21', 'ERA Imobiliária', 'KW Lead', 'Zome', 'IAD Portugal'];
const EXPERIENCES = ['1 ano', '3 anos', '5 anos', '8 anos', '10 anos'];
const REVENUES = ['€60,000', '€85,000', '€120,000', '€45,000', '€250,000'];
const PROPERTIES_VOLUMES = ['15 por ano', '25 por ano', '10 por ano', '40 por ano'];
const DIGITAL_ADOPTION_LEVELS = ['Iniciante', 'Intermédio', 'Cético', 'Experiente'];
const DREAMS_FEARS = ['Medo de ficar para trás da concorrência', 'Sonho de ter mais tempo livre para a família', 'Medo da instabilidade do mercado', 'Sonho de ser o consultor número 1 da sua zona'];

const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const generateScenarioData = (exerciseType: ExerciseType): ScenarioData => {
    const gender: 'male' | 'female' = Math.random() > 0.5 ? 'male' : 'female';
    const name = getRandom(gender === 'male' ? MALE_NAMES : FEMALE_NAMES);
    const avatarUrl = `https://avatar.iran.liara.run/public/${gender === 'male' ? 'boy' : 'girl'}?username=${encodeURIComponent(name)}`;
    
    const base = {
        name,
        gender,
        avatarUrl,
        brand: getRandom(BRANDS),
    };

    switch (exerciseType) {
        case ExerciseType.QUALIFY:
            return {
                ...base,
                experience: getRandom(EXPERIENCES),
                revenue: getRandom(REVENUES),
                initialPhrase: "Alô?",
                context: "Este lead viu e preencheu um anúncio da Digital Revolution no Facebook. Já demonstrou algum interesse na solução da empresa."
            };
        case ExerciseType.COLD_QUALIFY:
            return {
                ...base,
                propertiesAcquired: getRandom(PROPERTIES_VOLUMES),
                initialPhrase: "Alô?",
                context: "Este lead nunca ouviu falar da Digital Revolution e não interagiu com a marca. Está a ser apanhado de surpresa."
            };
        case ExerciseType.EMOTION:
            return {
                ...base,
                revenue: getRandom(REVENUES),
                experience: getRandom(EXPERIENCES),
                digitalAdoption: getRandom(DIGITAL_ADOPTION_LEVELS),
                initialPhrase: "Olá, vamos começar a nossa reunião então?",
                context: "Uma reunião já foi agendada recentemente. O objetivo do vendedor é construir uma relação e identificar medos ou sonhos."
            };
        case ExerciseType.PROPOSAL:
            return {
                ...base,
                experience: getRandom(EXPERIENCES),
                dreamOrFear: getRandom(DREAMS_FEARS),
                revenue: getRandom(REVENUES),
                initialPhrase: "Ok, eu percebo, mas como é que me pode ajudar com isto?",
                context: "O vendedor já conhece os medos e sonhos do lead e deve agora apresentar a proposta, ligando os benefícios a esses pontos."
            };
        case ExerciseType.OBJECTIONS:
            return {
                ...base,
                experience: getRandom(EXPERIENCES),
                dreamOrFear: getRandom(DREAMS_FEARS),
                revenue: getRandom(REVENUES),
                initialPhrase: "Ok, eu percebo, mas tenho algumas dúvidas...",
                context: "O lead tem objeções sobre a proposta. O vendedor tem de ser capaz de as ultrapassar para que deixem de existir."
            };
    }
}

const SCENARIO_PERSONAS = {
    qualified: "Você é um consultor imobiliário com vontade de crescer. Você está aberto a novas tecnologias para conseguir mais leads, mas é um pouco ocupado. Você é um lead qualificado.",
    disqualified: "Você é um consultor imobiliário muito cético em relação a marketing digital e acredita apenas em métodos tradicionais. Você é um lead desqualificado.",
    qualified_difficult: "Você é um consultor imobiliário de sucesso. Já tentou marketing digital no passado sem sucesso e está muito desconfiado de agências. No entanto, sabe que precisa de ajuda. Você é um lead qualificado, mas difícil de convencer."
};

const DIFFICULTY_MODIFIERS = {
    [Difficulty.EASY]: "Aja de forma relativamente cooperativa e aberta. Faça perguntas simples.",
    [Difficulty.MEDIUM]: "Mostre algum ceticismo e pressa. Faça perguntas mais desafiadoras sobre o ROI e a eficácia.",
    [Difficulty.DIFFICULT]: "Seja muito cético, desconfiado e impaciente. Interrompa o vendedor e coloque objeções fortes e frequentes."
};

/**
 * Lógica de adaptação baseada no DISC
 * O objetivo é criar um agente que seja o oposto ou o maior desafio para o perfil do vendedor.
 */
const getDiscAdjustment = (discType?: DiscType): string => {
    if (!discType) return "";

    switch (discType) {
        case 'D': // Vendedor Dominante (Direto, focado em resultados)
            return "O vendedor tem um perfil Dominante. Para o desafiar, seja um lead 'Estável' (S): seja lento a decidir, mostre insegurança, foque muito nas pessoas e na harmonia da equipa, evite conflitos e resista a mudanças bruscas. Seja passivo-agressivo se ele for muito direto.";
        case 'I': // Vendedor Influente (Comunicativo, focado em pessoas)
            return "O vendedor tem um perfil Influente. Para o desafiar, seja um lead 'Conforme' (C): seja extremamente frio, exija dados, factos e provas por escrito. Não responda a piadas ou tentativas de rapport emocional. Seja monossilábico e focado apenas no detalhe técnico e no contrato.";
        case 'S': // Vendedor Estável (Paciente, focado em harmonia)
            return "O vendedor tem um perfil Estável. Para o desafiar, seja um lead 'Dominante' (D): seja impaciente, arrogante, interrompa constantemente e exija saber 'o que ganho com isto' em 10 segundos. Pressione-o por decisões rápidas e use um tom de voz autoritário.";
        case 'C': // Vendedor Conforme (Analítico, focado em dados)
            return "O vendedor tem um perfil Conforme. Para o desafiar, seja um lead 'Influente' (I): seja desorganizado, emocional, mude de assunto constantemente e tome decisões baseadas no 'feeling' e não nos dados que ele apresenta. Ignore as planilhas dele e fale sobre o churrasco do fim de semana.";
        default:
            return "";
    }
};

export const generateSystemPrompt = (exercise: Exercise, difficulty: Difficulty, scenarioData: ScenarioData, user?: User): string => {
    const discAdjustment = getDiscAdjustment(user?.discProfile?.type);

    const base = `Você é um agente de IA a simular um roleplay em Português de Portugal.
O utilizador é um vendedor da 'Digital Revolution', uma agência de marketing e vendas para consultores imobiliários.
Você representa ${scenarioData.name}, um(a) consultor(a) imobiliário(a) da ${scenarioData.brand}. A sua missão é agir de acordo com o seu perfil, o cenário e o nível de dificuldade definidos.
Responda de forma natural, como se estivesse numa chamada telefónica. Use pausas e interjeições.
Não revele que é uma IA ou que está a seguir um guião. Não mencione os detalhes do seu perfil (rendimento, experiência, etc.) a menos que o vendedor pergunte diretamente e de forma apropriada.

A sua PRIMEIRA FALA nesta conversa tem de ser EXATAMENTE, e APENAS, a seguinte frase: "${scenarioData.initialPhrase}"
Não adicione NADA antes ou depois desta frase na sua primeira resposta. Depois da sua primeira fala, aguarde pela resposta do vendedor.

Perfil de Comportamento: ${Object.values(SCENARIO_PERSONAS)[Math.floor(Math.random() * 3)]}
Nível de Dificuldade: ${DIFFICULTY_MODIFIERS[difficulty]}

ADAPTAÇÃO ESTRATÉGICA DISC:
${discAdjustment}
`;

    switch (exercise.type) {
        case ExerciseType.QUALIFY:
        case ExerciseType.COLD_QUALIFY:
            return base + "O objetivo do vendedor é qualificar você (rendimento > 50k, > 1 ano experiência, aberto ao digital), criar curiosidade e marcar uma reunião. Reaja de acordo com o seu perfil.";
        case ExerciseType.EMOTION:
            return base + "O objetivo do vendedor é descobrir os seus sonhos profissionais (ex: mais tempo livre, reconhecimento) e medos (ex: perder para a concorrência, instabilidade). Só partilhe estas emoções se o vendedor criar um ambiente de confiança.";
        case ExerciseType.PROPOSAL:
            return base + "O vendedor irá apresentar a proposta da 'Digital Revolution'. Ouça atentamente, mas faça perguntas críticas sobre os detalhes, custos e garantias.";
        case ExerciseType.OBJECTIONS:
            return base + "O seu papel é levantar objeções comuns como 'É muito caro', 'Não tenho tempo para isso', 'Já trabalho com outra pessoa', 'Não acredito que funcione'. Seja persistente nas suas objeções.";
        default:
            return base;
    }
};

export const generateAnalysisPrompt = (transcript: string, exercise: Exercise): string => {
    let exerciseGoals = '';
    switch(exercise.type) {
        case ExerciseType.QUALIFY:
        case ExerciseType.COLD_QUALIFY:
            exerciseGoals = 'Qualificar o lead (rendimento > 50k, > 1 ano de experiência, abertura ao digital), estimular a curiosidade, construir rapport e agendar uma reunião (se qualificado).';
            break;
        case ExerciseType.EMOTION:
            exerciseGoals = 'Descobrir os sonhos e medos do cliente, criando uma conexão emocional profunda.';
            break;
        case ExerciseType.PROPOSAL:
            exerciseGoals = 'Apresentar a proposta da Digital Revolution de forma clara, persuasiva e focada nos benefícios para o cliente.';
            break;
        case ExerciseType.OBJECTIONS:
            exerciseGoals = 'Responder eficazmente às objeções do cliente, mantendo o controlo da conversa e avançando para o fecho.';
            break;
    }

    return `
      Você é um coach de vendas especialista e rigoroso. Analise a seguinte transcrição de uma chamada de roleplay em Português de Portugal.
      Objetivo do vendedor: ${exerciseGoals}

      Avalie o desempenho do vendedor e forneça o seguinte resultado num único bloco de código JSON:
      {
        "score": <0-100>,
        "isQualified": <boolean>,
        "summary": "<Resumo executivo de 1 parágrafo sobre a chamada>",
        "failedPoints": ["<Ponto específico onde o vendedor falhou ou foi fraco>", "..."],
        "nextSteps": ["<Ponto de atenção ou técnica a aplicar no próximo treino para melhorar>", "..."]
      }

      Seja extremamente crítico nos 'failedPoints'. Identifique frases mal ditas, hesitações, falta de perguntas de qualificação ou perda de controlo da chamada.
      Nos 'nextSteps', forneça conselhos práticos e táticos.

      Transcrição:
      ${transcript}
    `;
};
