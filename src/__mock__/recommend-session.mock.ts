import { productMockData } from './product.mock';
import {
  RecommendSession,
  RecommendSessionResult,
  RecommendSessionStep,
} from '../domain/recommend-session';

export const recommendSessionMockData: Readonly<RecommendSession> = {
  id: 'recommend-session-uuid-v7',
  receiverName: '홍길동',
  steps: [],
  result: undefined,
  endedAt: undefined,
};

export const recommendSessionStepMockData: Readonly<RecommendSessionStep> = {
  id: 1,
  sessionId: 'recommend-session-uuid-v7',
  step: 1,
  question: '질문',
  options: ['옵션1', '옵션2', '옵션3', '옵션4'],
  answer: undefined,
};

export const recommendSessionResultMockData: Readonly<RecommendSessionResult> = {
  product: productMockData,
  reason: '추천 결과',
  order: 1,
};
