// types/batch.ts

import { ExperimentResponseData } from './steering';

export type DefinitiveAnswer = 'Yes' | 'No' | 'N/A' | 'Refusal';

export interface BatchResult {
  scenarioId: number;
  prompt: string;
  results: [ExperimentResponseData, ExperimentResponseData, ExperimentResponseData];
  answers: [DefinitiveAnswer, DefinitiveAnswer, DefinitiveAnswer];
  hasInconsistency: boolean;
}

export interface BatchRunRecord {
  id: string;
  timestamp: string;
  totalScenarios: number;
  inconsistentCount: number;
  results: BatchResult[];
}
