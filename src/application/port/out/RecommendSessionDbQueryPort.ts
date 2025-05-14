import { RecommendSession, RecommendSessionStep } from '../../../domain/recommend-session';

export interface RecommendSessionDbQueryPort {
  getSessionById(sessionId: string): Promise<RecommendSession>;
  getLastStep(sessionId: string): Promise<RecommendSessionStep>;
}
