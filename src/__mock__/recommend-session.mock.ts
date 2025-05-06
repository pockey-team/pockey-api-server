import {
  RecommendSession,
  RecommendSessionResult,
  RecommendSessionStep,
} from '../domain/recommend-session';

export const recommendSessionMockData: Readonly<RecommendSession> = {
  id: 'recommend-session-uuid-v7',
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
  sessionId: 'recommend-session-uuid-v7',
  recommendProductIds: [1, 2, 3],
  recommendText: '추천 결과',
};
