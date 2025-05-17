import {
  RecommendSession,
  RecommendSessionBaseStep,
  RecommendSessionResult,
} from '../../../domain/recommend-session';
import { StartSessionCommand } from '../in/recommend-session/RecommendSessionUseCase';

export class AddStepCommand {
  sessionId: string;
  question: string;
  options: string[];
}

export class CreateResultCommand {
  userId?: number;
  sessionId: string;
  recommendResults: {
    productId: number;
    reason: string;
    order: number;
  }[];
}

export interface RecommendSessionDbCommandPort {
  startSession(command: StartSessionCommand): Promise<RecommendSession>;
  createStep(command: AddStepCommand): Promise<RecommendSessionBaseStep>;
  createResult(command: CreateResultCommand): Promise<RecommendSessionResult[]>;
  updateAnswer(stepId: number, answer: string): Promise<void>;
  endSession(sessionId: string): Promise<void>;
}
