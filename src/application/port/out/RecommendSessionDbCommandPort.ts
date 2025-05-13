import {
  RecommendSession,
  RecommendSessionResult,
  RecommendSessionStep,
} from '../../../domain/recommend-session';

export class AddStepCommand {
  sessionId: string;
  question: string;
  options: string[];
}

export class CreateResultCommand {
  userId?: number;
  sessionId: string;
  recommendProductIds: number[];
  recommendText: string;
}

export interface RecommendSessionDbCommandPort {
  createSession(userId?: number): Promise<RecommendSession>;
  createStep(command: AddStepCommand): Promise<RecommendSessionStep>;
  createResult(command: CreateResultCommand): Promise<RecommendSessionResult>;
  updateAnswer(stepId: number, answer: string): Promise<void>;
  endSession(sessionId: string): Promise<void>;
}
