import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';

import { Session, SessionAnswer } from '../../domain/recommend-session';
import { RecommendSessionUseCase, SubmitAnswerCommand } from '../port/in/post/RecommendUseCase';

@Injectable()
export class RecommendSessionService implements RecommendSessionUseCase {
  private answerCountMap: Map<string, number> = new Map();

  async startSession(): Promise<Session> {
    return {
      sessionId: uuidv7(),
      question: {
        question: '질문',
        questionOptions: ['옵션1', '옵션2', '옵션3'],
      },
    };
  }

  async submitAnswer(command: SubmitAnswerCommand): Promise<SessionAnswer> {
    const currentCount = (this.answerCountMap.get(command.sessionId) || 0) + 1;
    this.answerCountMap.set(command.sessionId, currentCount);

    if (currentCount % 5 === 0) {
      return {
        type: 'result',
        resultId: 1,
      };
    }

    return {
      type: 'question',
      question: {
        question: '질문',
        questionOptions: ['옵션1', '옵션2', '옵션3'],
      },
    };
  }

  async endSession(sessionId: string): Promise<void> {
    this.answerCountMap.delete(sessionId);
    return;
  }
}
