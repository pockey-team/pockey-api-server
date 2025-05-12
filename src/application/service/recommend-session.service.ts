import { Inject, Injectable } from '@nestjs/common';

import { OpenAiClient } from '../../adapter/llm/openai.client';
import { RecommendSessionResult, RecommendSessionStep } from '../../domain/recommend-session';
import {
  RecommendSessionAlreadyEndedException,
  RecommendSessionInvalidAnswerException,
  RecommendSessionNotFoundException,
} from '../common/error/exception/recommend-session.exception';
import {
  RecommendSessionUseCase,
  StartSessionCommand,
  SubmitAnswerCommand,
} from '../port/in/recommend-session/RecommendSessionUseCase';
import { CommonQuestionDbQueryPort } from '../port/out/CommonQuestionDbQueryPort';
import { RecommendSessionDbCommandPort } from '../port/out/RecommendSessionDbCommandPort';
import { RecommendSessionDbQueryPort } from '../port/out/RecommendSessionDbQueryPort';

@Injectable()
export class RecommendSessionService implements RecommendSessionUseCase {
  constructor(
    @Inject('RecommendSessionGateway')
    private readonly sessionDbQueryPort: RecommendSessionDbQueryPort,
    @Inject('RecommendSessionGateway')
    private readonly sessionDbCommandPort: RecommendSessionDbCommandPort,
    @Inject('CommonQuestionGateway')
    private readonly commonQuestionDbQueryPort: CommonQuestionDbQueryPort,

    private readonly openAiClient: OpenAiClient,
  ) {}

  async startSession(command: StartSessionCommand): Promise<RecommendSessionStep> {
    const session = await this.sessionDbCommandPort.startSession(command);

    const commonQuestions = await this.commonQuestionDbQueryPort.getCommonQuestionsByStep(1);
    const commonQuestion = commonQuestions[0];
    const question = `${session.receiverName}${commonQuestion.question}`;
    const options = commonQuestion.options;

    return this.sessionDbCommandPort.createStep({
      sessionId: session.id,
      question,
      options,
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
    if (!lastStep.options.some(option => option === command.answer)) {
      throw new RecommendSessionInvalidAnswerException();
    }

    await this.sessionDbCommandPort.updateAnswer(lastStep.id, command.answer);

    const nextStep = lastStep.step + 1;
    if (nextStep > 8) {
      return this.generateAnswer(command.sessionId);
    }

    return this.generateNextStep(command.sessionId, session.receiverName, nextStep);
  }

  private async generateNextStep(sessionId: string, receiverName: string, step: number) {
    switch (step) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        return this.generateCommonQuestion(sessionId, receiverName, step);
      case 6:
        return this.generateRandomCommonQuestion(sessionId, step);
      default:
        return this.generateLLMQuestion(sessionId);
    }
  }

  private async generateCommonQuestion(
    sessionId: string,
    receiverName: string,
    step: number,
  ): Promise<RecommendSessionStep> {
    const commonQuestions = await this.commonQuestionDbQueryPort.getCommonQuestionsByStep(step);
    const commonQuestion = commonQuestions[0];
    return this.sessionDbCommandPort.createStep({
      sessionId,
      question: `${receiverName}${commonQuestion.question}`,
      options: commonQuestion.options,
      optionImages: commonQuestion.optionImages,
    });
  }

  private async generateRandomCommonQuestion(
    sessionId: string,
    step: number,
  ): Promise<RecommendSessionStep> {
    const commonQuestions = await this.commonQuestionDbQueryPort.getCommonQuestionsByStep(step);
    const selectedQuestion = commonQuestions[Math.floor(Math.random() * commonQuestions.length)];
    return this.sessionDbCommandPort.createStep({
      sessionId,
      question: selectedQuestion.question,
      options: selectedQuestion.options,
    });
  }

  private async generateLLMQuestion(sessionId: string): Promise<RecommendSessionStep> {
    // TODO: LLM 통해 생성하도록 변경

    const session = await this.sessionDbQueryPort.getSessionById(sessionId);
    const input = session.steps
      .map(step => `질문:${step.question}/선택지:${step.options.join('\n')}/답변:${step.answer}`)
      .join('\n');

    const llmRecommend = await this.openAiClient.generateQuestion(input);
    return this.sessionDbCommandPort.createStep({
      sessionId,
      ...llmRecommend,
    });
  }

  private async generateAnswer(sessionId: string): Promise<RecommendSessionResult> {
    // TODO: LLM 통해 생성하도록 변경
    const generatedRecommendProductIds = [1, 2, 3];
    const generatedRecommendText = '추천 결과';

    const result = await this.sessionDbCommandPort.createResult({
      sessionId,
      recommendProductIds: generatedRecommendProductIds,
      recommendText: generatedRecommendText,
    });
    await this.sessionDbCommandPort.endSession(sessionId);

    return result;
  }

  async endSession(sessionId: string): Promise<void> {
    await this.sessionDbCommandPort.endSession(sessionId);
  }
}
