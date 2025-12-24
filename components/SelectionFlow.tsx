
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import SelectionScreen from './SelectionScreen';
import ScenarioScreen from './ScenarioScreen';
import RoleplayScreen from './RoleplayScreen';
import AnalysisScreen from './AnalysisScreen';
import { Exercise, Difficulty, Transcript, ScenarioData, Recording, AnalysisResult, User } from '../types';
import { generateScenarioData, generateAnalysisPrompt } from '../constants';

type FlowState = 'selection' | 'scenario' | 'roleplay' | 'analysis';

interface SelectionFlowProps {
    onSaveRecording: (recording: Omit<Recording, 'id' | 'date' | 'userId'>) => void;
    user: User;
    recordings: Recording[];
}

const SelectionFlow: React.FC<SelectionFlowProps> = ({ onSaveRecording, user, recordings }) => {
  const [flowState, setFlowState] = useState<FlowState>('selection');

  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [scenarioData, setScenarioData] = useState<ScenarioData | null>(null);

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<Transcript[] | null>(null);
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null);
  const [aiAudioUrl, setAiAudioUrl] = useState<string | null>(null);

  const handleProceedToScenario = useCallback((exercise: Exercise, difficulty: Difficulty) => {
    setSelectedExercise(exercise);
    setSelectedDifficulty(difficulty);
    const data = generateScenarioData(exercise.type);
    setScenarioData(data);
    setFlowState('scenario');
  }, []);

  const handleStartRoleplay = useCallback(() => {
    if(selectedExercise && selectedDifficulty && scenarioData) {
        setFlowState('roleplay');
    }
  }, [selectedExercise, selectedDifficulty, scenarioData]);

  const handleRoleplayEnd = useCallback(async (transcript: Transcript[], userAudio: Blob, aiAudio: Blob) => {
      if(!selectedExercise || !selectedDifficulty) return;

      setFlowState('analysis');
      setIsLoadingAnalysis(true);
      setAnalysisError(null);
      setTranscript(transcript);

      const userUrl = URL.createObjectURL(userAudio);
      const aiUrl = URL.createObjectURL(aiAudio);
      setUserAudioUrl(userUrl);
      setAiAudioUrl(aiUrl);

      try {
        if (transcript.length === 0) {
           const emptyResult: AnalysisResult = {
             score: 0,
             isQualified: false,
             summary: "A chamada terminou sem nenhuma interação. Não foi possível realizar a análise.",
             failedPoints: ["Nenhuma interação detetada"],
             nextSteps: ["Tente falar algo na próxima chamada"]
           };
           setAnalysisResult(emptyResult);
           
            onSaveRecording({
                exercise: selectedExercise,
                difficulty: selectedDifficulty,
                transcript,
                analysis: emptyResult,
                userAudioUrl: userUrl,
                aiAudioUrl: aiUrl
            });
           return;
        }
  
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            throw new Error("API_KEY não encontrada nas variáveis de ambiente. Por favor, verifique se fez o 'Redeploy' no Vercel.");
        }

        const fullTranscriptText = transcript.map(t => `${t.speaker === 'user' ? 'VENDEDOR' : 'CLIENTE'}: ${t.text}`).join('\n');
        const prompt = generateAnalysisPrompt(fullTranscriptText, selectedExercise);
  
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        let result: AnalysisResult;
        try {
            const text = response.text || "{}";
            result = JSON.parse(text);
        } catch (parseError) {
            console.error("Failed to parse JSON response from AI:", response.text, parseError);
            throw new Error("A IA forneceu uma análise em formato inválido. Não foi possível processar o resultado.");
        }
        
        setAnalysisResult(result);

        onSaveRecording({
            exercise: selectedExercise,
            difficulty: selectedDifficulty,
            transcript,
            analysis: result,
            userAudioUrl: userUrl,
            aiAudioUrl: aiUrl
        });

      } catch (err) {
        console.error("Error getting analysis:", err);
        const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
        setAnalysisError(`Não foi possível analisar a sua performance. ${errorMessage}`);
      } finally {
        setIsLoadingAnalysis(false);
      }
  }, [selectedExercise, selectedDifficulty, onSaveRecording]);
  
  const handleBackToSelection = useCallback(() => {
    setFlowState('selection');
  }, []);

  const handleBackToScenario = useCallback(() => {
    setFlowState('scenario');
  }, []);

  const handleResetFlow = useCallback(() => {
    setSelectedExercise(null);
    setSelectedDifficulty(null);
    setScenarioData(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    setIsLoadingAnalysis(false);
    setTranscript(null);
    setUserAudioUrl(null);
    setAiAudioUrl(null);
    setFlowState('selection');
  }, []);

  const renderContent = () => {
    switch (flowState) {
      case 'selection':
        return <SelectionScreen onStart={handleProceedToScenario} recordings={recordings} />;
      
      case 'scenario':
        if (!scenarioData) {
            handleResetFlow();
            return null;
        }
        return <ScenarioScreen scenarioData={scenarioData} onStartCall={handleStartRoleplay} onBack={handleBackToSelection} />;

      case 'roleplay':
        if (!selectedExercise || !selectedDifficulty || !scenarioData) {
            handleResetFlow();
            return null;
        }
        return <RoleplayScreen 
            exercise={selectedExercise} 
            difficulty={selectedDifficulty}
            scenarioData={scenarioData}
            onRoleplayEnd={handleRoleplayEnd} 
            onBack={handleBackToScenario}
            user={user} />;
      
      case 'analysis':
        return <AnalysisScreen 
            analysisResult={analysisResult} 
            isLoading={isLoadingAnalysis}
            error={analysisError}
            onTryAgain={handleResetFlow}
            transcript={transcript}
            userAudioUrl={userAudioUrl}
            aiAudioUrl={aiAudioUrl}
            />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
        {renderContent()}
    </div>
  );
};

export default SelectionFlow;
