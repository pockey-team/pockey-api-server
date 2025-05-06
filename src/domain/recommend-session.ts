export class Question {
  question: string;
  questionOptions: string[];
}

export class Session {
  sessionId: string;
  question: Question;
}

export class QuestionAnswer {
  type: 'question';
  question: Question;
}

export class ResultAnswer {
  type: 'result';
  resultId: number;
}

export type SessionAnswer = QuestionAnswer | ResultAnswer;
