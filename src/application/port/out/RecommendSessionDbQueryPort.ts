import {
  RecommendSession,
  RecommendSessionBaseStep,
  RecommendSessionResult,
} from '../../../domain/recommend-session';

export interface RecommendSessionDbQueryPort {
  getSessionById(sessionId: string): Promise<RecommendSession>;
  getSessionResultsById(sessionId: string): Promise<RecommendSessionResult[]>;
  getSessionResultById(sessionId: string, order: number): Promise<RecommendSessionResult>;
  getLastStep(sessionId: string): Promise<RecommendSessionBaseStep>;
}
