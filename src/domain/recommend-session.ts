export class RecommendSession {
  id: string;
  receiverName: string;
  steps: RecommendSessionStep[];
  result?: RecommendSessionResult;
  endedAt?: Date;
}

export class RecommendSessionStep {
  id: number;
  sessionId: string;
  step: number;
  question: string;
  options: string[];
  answer?: string;
}

export class RecommendSessionResult {
  sessionId: string;
  recommendProductIds: number[];
  recommendText: string;
}
