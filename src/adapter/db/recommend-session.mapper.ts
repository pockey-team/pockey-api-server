import { RecommendSessionResultDbEntity } from './recommend-session-result.entity';
import { RecommendSessionStepDbEntity } from './recommend-session-step.entity';
import { RecommendSessionDbEntity } from './recommend-session.entity';
import {
  RecommendSession,
  RecommendSessionResult,
  RecommendSessionStep,
} from '../../domain/recommend-session';

export const mapToRecommendSession = (dbEntity: RecommendSessionDbEntity): RecommendSession => {
  return {
    id: dbEntity.id,
    receiverName: dbEntity.receiverName,
    steps:
      dbEntity.steps && dbEntity.steps.length > 0
        ? dbEntity.steps.map(step => mapToRecommendSessionStep(step))
        : [],
    result: dbEntity.result ? mapToRecommendSessionResult(dbEntity.result) : undefined,
    endedAt: dbEntity.endedAt ?? undefined,
  };
};

export const mapToRecommendSessionStep = (
  dbEntity: RecommendSessionStepDbEntity,
): RecommendSessionStep => {
  return {
    id: dbEntity.id,
    sessionId: dbEntity.session.id,
    step: dbEntity.step,
    question: dbEntity.question,
    options: dbEntity.options,
    optionImages: dbEntity.optionImages,
    answer: dbEntity.answer,
  };
};

export const mapToRecommendSessionResult = (
  dbEntity: RecommendSessionResultDbEntity,
): RecommendSessionResult => {
  return {
    sessionId: dbEntity.session.id,
    recommendProductIds: dbEntity.recommendedProductIds,
    recommendText: dbEntity.recommendText,
  };
};
