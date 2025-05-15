import { productMockData } from './product.mock';
import {
  RecommendSession,
  RecommendSessionBaseStep,
  RecommendSessionResult,
} from '../domain/recommend-session';

export const recommendSessionMockData: Readonly<RecommendSession> = {
  id: 'recommend-session-uuid-v7',
  receiverName: '홍길동',
  steps: [],
  results: [],
  endedAt: undefined,
};

export const recommendSessionStepMockData: Readonly<RecommendSessionBaseStep> = {
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
  minifiedReason: '바쁜 하루를 마친 후 손끝에 잔잔한 위로를',
  order: 1,
};
