import { Inject, Injectable } from '@nestjs/common';

import { OpenAiClient } from '../../adapter/llm/openai.client';
import { retry } from '../../common/util/retry.util';
import {
  RecommendSession,
  RecommendSessionFirstStep,
  RecommendSessionOccasionStep,
  RecommendSessionResult,
  RecommendSessionStep,
  RecommendSessionStepResponse,
  RecommendSessionStepType,
} from '../../domain/recommend-session';
import {
  RecommendProductNotFoundException,
  RecommendSessionAlreadyEndedException,
  RecommendSessionInvalidAnswerException,
  RecommendSessionNotFoundException,
} from '../common/error/exception/recommend-session.exception';
import { ProductDbQueryPort } from '../port/in/product/ProductDbQueryPort';
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
  private readonly STEP_COUNT = {
    setupCount: 4,
    occasionCount: 1,
    questionCount: 4,
  };

  private readonly optionMap = {
    ['생일 축하']: { key: 'birthday', title: '생일 축하', description: '님의 생일이에요' },
    ['고마워요']: { key: 'thankyou', title: '고마워요', description: '님께 고마운 마음이에요' },
    ['축하해요']: {
      key: 'congratulation',
      title: '축하해요',
      description: '님께 기쁜 마음을 전해요',
    },
    ['응원해요']: { key: 'support', title: '응원해요', description: '님을 응원해요' },
    ['미안한 마음']: {
      key: 'sorry',
      title: '미안한 마음',
      description: '님께 미안한 마음을 전해요',
    },
  };

  constructor(
    @Inject('CommonQuestionGateway')
    private readonly commonQuestionDbQueryPort: CommonQuestionDbQueryPort,
    @Inject('RecommendSessionGateway')
    private readonly sessionDbQueryPort: RecommendSessionDbQueryPort,
    @Inject('RecommendSessionGateway')
    private readonly sessionDbCommandPort: RecommendSessionDbCommandPort,
    @Inject('ProductGateway')
    private readonly productDbQueryPort: ProductDbQueryPort,

    private readonly openAiClient: OpenAiClient,
  ) {}

  async startSession(command: StartSessionCommand): Promise<RecommendSessionFirstStep> {
    const session = await this.sessionDbCommandPort.startSession(command);

    const commonQuestions = await this.commonQuestionDbQueryPort.getCommonQuestionsByStep(1);
    const commonQuestion = commonQuestions[0];
    const question = `${session.receiverName}${commonQuestion.question}`;
    const options = commonQuestion.options;

    const recommendSessionStep = await this.sessionDbCommandPort.createStep({
      sessionId: session.id,
      question,
      options,
    });

    return {
      ...recommendSessionStep,
      ...this.STEP_COUNT,
      type: RecommendSessionStepType.SETUP,
      sessionId: session.id,
    };
  }

  async submitAnswer(command: SubmitAnswerCommand): Promise<RecommendSessionStepResponse> {
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
    if (nextStep > 9) {
      return this.generateAnswer(command.sessionId);
    }

    return this.generateNextStep(command.sessionId, session.receiverName, nextStep);
  }

  private async generateNextStep(
    sessionId: string,
    receiverName: string,
    step: number,
  ): Promise<RecommendSessionStep | RecommendSessionOccasionStep> {
    switch (step) {
      case 1:
      case 2:
      case 3:
      case 4:
        return this.generateCommonQuestion(sessionId, receiverName, step);
      case 5:
        return this.generateOccasionQuestion(sessionId, receiverName, step);
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
    const recommendSessionStep = await this.sessionDbCommandPort.createStep({
      sessionId,
      question: `${receiverName}${commonQuestion.question}`,
      options: commonQuestion.options,
    });

    return { ...recommendSessionStep, type: RecommendSessionStepType.SETUP };
  }

  private async generateOccasionQuestion(
    sessionId: string,
    receiverName: string,
    step: number,
  ): Promise<RecommendSessionOccasionStep> {
    const commonQuestions = await this.commonQuestionDbQueryPort.getCommonQuestionsByStep(step);
    const commonQuestion = commonQuestions[0];
    const recommendSessionStep = await this.sessionDbCommandPort.createStep({
      sessionId,
      question: `${receiverName}${commonQuestion.question}`,
      options: commonQuestion.options,
    });

    const options = commonQuestion.options
      .map(option => this.optionMap[option as keyof typeof this.optionMap])
      .map(option => ({
        key: option.key,
        title: option.title,
        description: `${receiverName}${option.description}`,
      }));

    return {
      ...recommendSessionStep,
      type: RecommendSessionStepType.OCCASION,
      description: '선물을 주고자 하는 상황을 알려주세요',
      options,
    };
  }

  private async generateRandomCommonQuestion(
    sessionId: string,
    step: number,
  ): Promise<RecommendSessionStep> {
    const commonQuestions = await this.commonQuestionDbQueryPort.getCommonQuestionsByStep(step);
    const selectedQuestion = commonQuestions[Math.floor(Math.random() * commonQuestions.length)];
    const recommendSessionStep = await this.sessionDbCommandPort.createStep({
      sessionId,
      question: selectedQuestion.question,
      options: selectedQuestion.options,
    });

    return {
      ...recommendSessionStep,
      type: RecommendSessionStepType.QUESTION,
    };
  }

  private async generateLLMQuestion(sessionId: string): Promise<RecommendSessionStep> {
    const session = await this.sessionDbQueryPort.getSessionById(sessionId);

    const input = this.generateQuestionLlmInput(session);
    const generateQuestion = async () => await this.openAiClient.generateQuestion(input);
    const llmQuestion = await retry(generateQuestion, { maxRetries: 3 });

    const recommendSessionStep = await this.sessionDbCommandPort.createStep({
      sessionId,
      ...llmQuestion,
    });

    return {
      ...recommendSessionStep,
      type: RecommendSessionStepType.QUESTION,
    };
  }

  async endSession(sessionId: string): Promise<void> {
    await this.sessionDbCommandPort.endSession(sessionId);
  }

  private generateQuestionLlmInput(session: RecommendSession) {
    return session.steps
      .map(step => `질문:${step.question}/선택지:${step.options.join(',')}/답변:${step.answer}`)
      .join('\n');
  }

  private async generateAnswer(sessionId: string): Promise<RecommendSessionResult[]> {
    const session = await this.sessionDbQueryPort.getSessionById(sessionId);
    const input = this.generateQuestionLlmInput(session);

    const step1Answer = session.steps[0].answer;
    const step2Answer = session.steps[1].answer;
    const step3Answer = session.steps[2].answer;
    const step4Answer = session.steps[3].answer;

    if (!step1Answer || !step2Answer || !step3Answer || !step4Answer) {
      throw new RecommendSessionInvalidAnswerException();
    }

    const recommendProducts = await this.productDbQueryPort.getProducts({
      targetGender: [step1Answer, '성별 무관'],
      ageRange: step2Answer,
      priceRange: step4Answer,
      friendshipLevel: step3Answer,
    });
    if (recommendProducts.length === 0) {
      throw new RecommendProductNotFoundException();
    }

    const llmAnswer = await retry(
      async () => await this.openAiClient.recommendGift(input, recommendProducts),
      { maxRetries: 3 },
    );
    const result = await this.sessionDbCommandPort.createResult({
      sessionId,
      recommendResults: llmAnswer.map(
        (answer: { id: number; reason: string; minifiedReason: string }, index: number) => ({
          productId: +answer.id,
          reason: answer.reason,
          minifiedReason: answer.minifiedReason,
          order: index + 1,
        }),
      ),
    });
    await this.sessionDbCommandPort.endSession(sessionId);

    return result;
  }
}
