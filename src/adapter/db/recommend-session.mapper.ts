import { mapToProduct } from './product.mapper';
import { RecommendSessionResultDbEntity } from './recommend-session-result.entity';
import { RecommendSessionStepDbEntity } from './recommend-session-step.entity';
import { RecommendSessionDbEntity } from './recommend-session.entity';
import {
  RecommendSession,
  RecommendSessionBaseStep,
  RecommendSessionResult,
} from '../../domain/recommend-session';

export const mapToRecommendSession = (dbEntity: RecommendSessionDbEntity): RecommendSession => {
  return {
    id: dbEntity.id,
    receiverName: dbEntity.receiverName,
    steps:
      dbEntity.steps && dbEntity.steps.length > 0
        ? dbEntity.steps.map(step => mapToRecommendSessionBaseStep(step))
        : [],
    results:
      dbEntity.results && dbEntity.results.length > 0
        ? dbEntity.results.map(result => mapToRecommendSessionResult(result))
        : [],
    endedAt: dbEntity.endedAt ?? undefined,
  };
};

export const mapToRecommendSessionBaseStep = (
  dbEntity: RecommendSessionStepDbEntity,
): RecommendSessionBaseStep => {
  return {
    id: dbEntity.id,
    sessionId: dbEntity.session.id,
    step: dbEntity.step,
    question: dbEntity.question,
    options: dbEntity.options,
    answer: dbEntity.answer,
  };
};

export const mapToRecommendSessionResult = (
  dbEntity: RecommendSessionResultDbEntity,
): RecommendSessionResult => {
  return {
    product: mapToProduct(dbEntity.product),
    reason: dbEntity.reason,
    minifiedReason: dbEntity.minifiedReason,
    order: dbEntity.order,
  };
};
