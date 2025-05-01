import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';

import { AnswerResponse, RecommendResult, SessionResponse } from '../../domain/recommend';
import { RecommendUseCase, SubmitAnswerCommand } from '../port/in/post/RecommendUseCase';

@Injectable()
export class RecommendService implements RecommendUseCase {
  private answerCountMap: Map<string, number> = new Map();

  constructor() {}
  async startSession(): Promise<SessionResponse> {
    return {
      sessionId: uuidv7(),
      question: {
        question: '질문',
        questionOptions: ['옵션1', '옵션2', '옵션3'],
      },
    };
  }

  async submitAnswer(command: SubmitAnswerCommand): Promise<AnswerResponse> {
    const currentCount = (this.answerCountMap.get(command.sessionId) || 0) + 1;
    this.answerCountMap.set(command.sessionId, currentCount);

    if (currentCount % 5 === 0) {
      return {
        type: 'result',
        recommendResultId: 1,
      };
    }

    return {
      type: 'next_question',
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

  async getResult(sessionId: string): Promise<RecommendResult> {
    return {
      sessionId,
      type: 'result',
      recommendResultId: 1,
    };
  }

  async getSessions(userId: string): Promise<RecommendResult[]> {
    return [
      {
        sessionId: 'sessionId',
        type: 'result',
        recommendResultId: 1,
      },
    ];
  }
}
