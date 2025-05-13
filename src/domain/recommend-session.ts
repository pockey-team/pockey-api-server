import { Product } from './product';

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
  optionImages?: string[];
  answer?: string;
}

export class RecommendSessionResult {
  product: Product;
  reason: string;
  order: number;
}
