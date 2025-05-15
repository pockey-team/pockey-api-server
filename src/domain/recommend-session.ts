import { Product } from './product';

export enum RecommendSessionStepType {
  SETUP = 'setup',
  OCCASION = 'occasion',
  QUESTION = 'question',
}

export class RecommendSession {
  id: string;
  receiverName: string;
  steps: RecommendSessionBaseStep[];
  results?: RecommendSessionResult[];
  endedAt?: Date;
}

export class RecommendSessionFirstStep {
  type: RecommendSessionStepType.SETUP;
  id: number;
  sessionId: string;
  step: number;
  question: string;
  options: string[];
  setupCount: number;
  occasionCount: number;
  questionCount: number;
}

export type OccasionOptions = {
  key: string;
  title: string;
  description: string;
};

export class RecommendSessionBaseStep {
  id: number;
  sessionId: string;
  step: number;
  question: string;
  options: string[];
  answer?: string;
}

export class RecommendSessionOccasionStep {
  type: RecommendSessionStepType.OCCASION;
  id: number;
  sessionId: string;
  step: number;
  question: string;
  description: string;
  options: OccasionOptions[];
  answer?: string;
}

export class RecommendSessionStep {
  type: RecommendSessionStepType.SETUP | RecommendSessionStepType.QUESTION;
  id: number;
  sessionId: string;
  step: number;
  question: string;
  options: string[];
  answer?: string;
}

export class RecommendSessionResult {
  product: Product;
  reason: string;
  minifiedReason: string;
  order: number;
}

export type RecommendSessionStepResponse =
  | RecommendSessionOccasionStep
  | RecommendSessionStep
  | RecommendSessionResult[];
