import { Inject, Injectable } from '@nestjs/common';

import { RecommendSessionResult, RecommendSessionStep } from '../../domain/recommend-session';
import {
  RecommendSessionAlreadyEndedException,
  RecommendSessionNotFoundException,
} from '../common/error/exception/recommend-session.exception';
import {
  RecommendSessionUseCase,
  SubmitAnswerCommand,
} from '../port/in/recommend-session/RecommendSessionUseCase';
import { RecommendSessionDbCommandPort } from '../port/out/RecommendSessionDbCommandPort';
import { RecommendSessionDbQueryPort } from '../port/out/RecommendSessionDbQueryPort';

@Injectable()
export class RecommendSessionService implements RecommendSessionUseCase {
  private readonly lastStep = 4;

  constructor(
    @Inject('RecommendSessionGateway')
    private readonly sessionDbQueryPort: RecommendSessionDbQueryPort,
    @Inject('RecommendSessionGateway')
    private readonly sessionDbCommandPort: RecommendSessionDbCommandPort,
  ) {}

  async startSession(userId?: number): Promise<RecommendSessionStep> {
    const session = await this.sessionDbCommandPort.createSession(userId);

    // TODO: LLM 통해 생성하도록 변경
    const generatedQuestion = '질문';
    const generatedOptions = ['옵션1', '옵션2', '옵션3', '옵션4'];

    return this.sessionDbCommandPort.createStep({
      sessionId: session.id,
      question: generatedQuestion,
      options: generatedOptions,
    });
  }

  async submitAnswer(
    command: SubmitAnswerCommand,
  ): Promise<RecommendSessionStep | RecommendSessionResult> {
    const session = await this.sessionDbQueryPort.getSessionById(command.sessionId);

    if (!session) {
      throw new RecommendSessionNotFoundException();
    } else if (session.endedAt) {
      throw new RecommendSessionAlreadyEndedException();
    }

    const lastStep = await this.sessionDbQueryPort.getLastStep(command.sessionId);
    await this.sessionDbCommandPort.updateAnswer(lastStep.id, command.answer);

    if (lastStep.step === this.lastStep) {
      // TODO: LLM 통해 생성하도록 변경
      const generatedRecommendProductIds = [1, 2, 3];
      const generatedRecommendText = '추천 결과';

      await this.sessionDbCommandPort.endSession(session.id);

      return this.sessionDbCommandPort.createResult({
        sessionId: session.id,
        recommendProductIds: generatedRecommendProductIds,
        recommendText: generatedRecommendText,
      });
    }

    // TODO: LLM 통해 생성하도록 변경
    const generatedQuestion = '질문';
    const generatedOptions = ['옵션1', '옵션2', '옵션3', '옵션4'];

    return this.sessionDbCommandPort.createStep({
      sessionId: session.id,
      question: generatedQuestion,
      options: generatedOptions,
    });
  }

  async endSession(sessionId: string): Promise<void> {
    await this.sessionDbCommandPort.endSession(sessionId);
  }
}
