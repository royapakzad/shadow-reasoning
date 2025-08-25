// types/steering.ts

export interface ExperimentResponseData {
  title: string;
  policyType: 'none' | 'english' | 'native';
  rawResponse: string;
  reasoning: string | null;
  answer: string;
  reasoningWordCount: number;
  answerWordCount: number;
  generationTimeSeconds?: number;
}

export interface SummarizationRecord {
  id: string;
  timestamp: string;
  sourceWordCount: number;
  results: [ExperimentResponseData, ExperimentResponseData, ExperimentResponseData];
}
