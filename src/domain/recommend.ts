export interface Question {
  question: string;
  questionOptions: string[];
}

export interface SessionResponse {
  sessionId: string;
  question: Question;
}

export interface AnswerResponse {
  type: 'next_question' | 'result';
  question?: Question;
  recommendResultId?: number;
}

export interface RecommendResult {
  sessionId: string;
  type: 'result';
  recommendResultId: number;
}
