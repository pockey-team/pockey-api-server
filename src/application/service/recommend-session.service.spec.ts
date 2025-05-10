import { Test, TestingModule } from '@nestjs/testing';

import {
  commonQuestionMockData,
  recommendSessionMockData,
  recommendSessionResultMockData,
  recommendSessionStepMockData,
} from '../../__mock__';
import { RecommendSession, RecommendSessionStep } from '../../domain/recommend-session';
import {
  RecommendSessionAlreadyEndedException,
  RecommendSessionInvalidAnswerException,
  RecommendSessionNotFoundException,
} from '../common/error/exception/recommend-session.exception';
import {
  StartSessionCommand,
  SubmitAnswerCommand,
} from '../port/in/recommend-session/RecommendSessionUseCase';
import { CommonQuestionDbQueryPort } from '../port/out/CommonQuestionDbQueryPort';
import { RecommendSessionDbCommandPort } from '../port/out/RecommendSessionDbCommandPort';
import { RecommendSessionDbQueryPort } from '../port/out/RecommendSessionDbQueryPort';
import { RecommendSessionService } from './recommend-session.service';

describe('RecommendSessionService', () => {
  let service: RecommendSessionService;
  let queryPortMock: jest.Mocked<RecommendSessionDbQueryPort>;
  let commandPortMock: jest.Mocked<RecommendSessionDbCommandPort>;
  let commonQuestionQueryPortMock: jest.Mocked<CommonQuestionDbQueryPort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendSessionService,
        {
          provide: 'RecommendSessionGateway',
          useValue: {
            getSessionById: jest.fn(),
            getLastStep: jest.fn(),
            startSession: jest.fn(),
            createStep: jest.fn(),
            updateAnswer: jest.fn(),
            createResult: jest.fn(),
            endSession: jest.fn(),
          },
        },
        {
          provide: 'CommonQuestionGateway',
          useValue: {
            getCommonQuestionsByStep: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RecommendSessionService>(RecommendSessionService);
    queryPortMock = module.get<jest.Mocked<RecommendSessionDbQueryPort>>('RecommendSessionGateway');
    commandPortMock =
      module.get<jest.Mocked<RecommendSessionDbCommandPort>>('RecommendSessionGateway');
    commonQuestionQueryPortMock =
      module.get<jest.Mocked<CommonQuestionDbQueryPort>>('CommonQuestionGateway');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('startSession', () => {
    it('세션을 시작할 수 있다', async () => {
      // given
      const session = recommendSessionMockData;
      commandPortMock.startSession.mockResolvedValue(session);

      const commonQuestion = commonQuestionMockData;
      commonQuestionQueryPortMock.getCommonQuestionsByStep.mockResolvedValue([commonQuestion]);

      const step = recommendSessionStepMockData;
      commandPortMock.createStep.mockResolvedValue(step);

      const command: StartSessionCommand = {
        userId: 1,
        receiverName: '홍길동',
        deviceId: 'deviceId',
      };

      // when
      const result = await service.startSession(command);

      // then
      expect(result).toEqual(step);
      expect(commandPortMock.startSession).toHaveBeenCalledWith(command);
      expect(commandPortMock.createStep).toHaveBeenCalledWith({
        sessionId: session.id,
        question: `${command.receiverName}${step.question}`,
        options: step.options,
      });
    });
  });

  describe('submitAnswer', () => {
    it('답변을 제출하면 네번째 질문까지는 이름을 포함한 공통 질문을 반환한다.', async () => {
      // given
      const session = recommendSessionMockData;
      queryPortMock.getSessionById.mockResolvedValue(session);

      const commonQuestion = commonQuestionMockData;
      commonQuestionQueryPortMock.getCommonQuestionsByStep.mockResolvedValue([commonQuestion]);

      const lastStep: RecommendSessionStep = {
        id: 1,
        sessionId: session.id,
        step: 1,
        question: '질문',
        options: ['옵션1', '옵션2', '옵션3', '옵션4'],
      };
      queryPortMock.getLastStep.mockResolvedValue(lastStep);

      const nextStep: RecommendSessionStep = {
        id: 2,
        sessionId: session.id,
        step: 2,
        question: `${session.receiverName}${commonQuestion.question}`,
        options: commonQuestion.options,
      };
      commandPortMock.createStep.mockResolvedValue(nextStep);

      const command: SubmitAnswerCommand = { sessionId: session.id, answer: '옵션1' };

      // when
      const result = await service.submitAnswer(command);

      // then
      expect(result).toEqual(nextStep);
      expect(queryPortMock.getSessionById).toHaveBeenCalledWith(session.id);
      expect(queryPortMock.getLastStep).toHaveBeenCalledWith(session.id);
      expect(commandPortMock.updateAnswer).toHaveBeenCalledWith(lastStep.id, command.answer);
      expect(commandPortMock.createStep).toHaveBeenCalledWith({
        sessionId: session.id,
        question: nextStep.question,
        options: nextStep.options,
      });
      expect(commandPortMock.endSession).not.toHaveBeenCalled();
      expect(commandPortMock.createResult).not.toHaveBeenCalled();
    });

    it('답변을 제출하면 다섯번째 질문에서는 랜덤 공통 질문을 반환한다.', async () => {
      // given
      const session = recommendSessionMockData;
      queryPortMock.getSessionById.mockResolvedValue(session);

      jest.spyOn(Math, 'random').mockReturnValue(0);

      const commonQuestion = { ...commonQuestionMockData, step: 4 };
      commonQuestionQueryPortMock.getCommonQuestionsByStep.mockResolvedValue([
        { ...commonQuestion, question: '랜덤 질문1' },
        { ...commonQuestion, question: '랜덤 질문2' },
        { ...commonQuestion, question: '랜덤 질문3' },
      ]);

      const lastStep: RecommendSessionStep = {
        id: 4,
        sessionId: session.id,
        step: 4,
        question: '질문',
        options: ['옵션1', '옵션2', '옵션3', '옵션4'],
      };
      queryPortMock.getLastStep.mockResolvedValue(lastStep);

      const nextStep: RecommendSessionStep = {
        id: 5,
        sessionId: session.id,
        step: 5,
        question: '랜덤 질문1',
        options: ['옵션1', '옵션2', '옵션3', '옵션4'],
      };
      commandPortMock.createStep.mockResolvedValue(nextStep);

      const command: SubmitAnswerCommand = { sessionId: session.id, answer: '옵션1' };

      // when
      const result = await service.submitAnswer(command);

      // then
      expect(result).toEqual(nextStep);
      expect(queryPortMock.getSessionById).toHaveBeenCalledWith(session.id);
      expect(queryPortMock.getLastStep).toHaveBeenCalledWith(session.id);
      expect(commandPortMock.updateAnswer).toHaveBeenCalledWith(lastStep.id, command.answer);
      expect(commandPortMock.createStep).toHaveBeenCalledWith({
        sessionId: session.id,
        question: nextStep.question,
        options: nextStep.options,
      });
      expect(commandPortMock.endSession).not.toHaveBeenCalled();
      expect(commandPortMock.createResult).not.toHaveBeenCalled();
    });

    it('답변을 제출하면 여섯번째 질문부터는 LLM 질문을 반환한다.', async () => {
      // given
      const session = recommendSessionMockData;
      queryPortMock.getSessionById.mockResolvedValue(session);

      const lastStep: RecommendSessionStep = {
        id: 5,
        sessionId: session.id,
        step: 5,
        question: '질문',
        options: ['옵션1', '옵션2', '옵션3', '옵션4'],
      };
      queryPortMock.getLastStep.mockResolvedValue(lastStep);

      const nextStep: RecommendSessionStep = {
        id: 6,
        sessionId: session.id,
        step: 6,
        question: 'LLM 질문',
        options: ['옵션1', '옵션2', '옵션3', '옵션4'],
      };
      commandPortMock.createStep.mockResolvedValue(nextStep);

      const command: SubmitAnswerCommand = { sessionId: session.id, answer: '옵션1' };

      // when
      const result = await service.submitAnswer(command);

      // then
      expect(result).toEqual(nextStep);
      expect(queryPortMock.getSessionById).toHaveBeenCalledWith(session.id);
      expect(queryPortMock.getLastStep).toHaveBeenCalledWith(session.id);
      expect(commandPortMock.updateAnswer).toHaveBeenCalledWith(lastStep.id, command.answer);
      expect(commandPortMock.createStep).toHaveBeenCalledWith({
        sessionId: session.id,
        question: nextStep.question,
        options: nextStep.options,
      });
      expect(commandPortMock.endSession).not.toHaveBeenCalled();
      expect(commandPortMock.createResult).not.toHaveBeenCalled();
    });

    it('마지막 단계에서 답변을 제출하면 추천 결과를 반환한다', async () => {
      // given
      const sessionId = 'session-id';
      const session = recommendSessionMockData;
      queryPortMock.getSessionById.mockResolvedValue(session);

      const lastStep: RecommendSessionStep = {
        id: 8,
        sessionId,
        step: 8,
        question: '질문',
        options: ['옵션1', '옵션2', '옵션3', '옵션4'],
      };
      queryPortMock.getLastStep.mockResolvedValue(lastStep);

      const result = recommendSessionResultMockData;
      commandPortMock.createResult.mockResolvedValue(result);

      const command: SubmitAnswerCommand = { sessionId: session.id, answer: '옵션1' };

      // when
      const submitResult = await service.submitAnswer(command);

      // then
      expect(submitResult).toEqual(result);
      expect(queryPortMock.getSessionById).toHaveBeenCalledTimes(1);
      expect(queryPortMock.getSessionById).toHaveBeenCalledWith(session.id);
      expect(queryPortMock.getLastStep).toHaveBeenCalledTimes(1);
      expect(queryPortMock.getLastStep).toHaveBeenCalledWith(session.id);
      expect(commandPortMock.updateAnswer).toHaveBeenCalledTimes(1);
      expect(commandPortMock.updateAnswer).toHaveBeenCalledWith(lastStep.id, command.answer);
      expect(commandPortMock.endSession).toHaveBeenCalledTimes(1);
      expect(commandPortMock.endSession).toHaveBeenCalledWith(session.id);
      expect(commandPortMock.createResult).toHaveBeenCalledTimes(1);
      expect(commandPortMock.createResult).toHaveBeenCalledWith({
        sessionId: session.id,
        recommendProductIds: result.recommendProductIds,
        recommendText: result.recommendText,
      });
      expect(commandPortMock.createStep).not.toHaveBeenCalled();
    });

    it('유효하지 않은 답변을 제출하면 예외가 발생한다', async () => {
      // given
      const sessionId = 'session-id';
      const session = recommendSessionMockData;
      queryPortMock.getSessionById.mockResolvedValue(session);

      const lastStep: RecommendSessionStep = {
        id: 1,
        sessionId,
        step: 1,
        question: '질문',
        options: ['옵션1', '옵션2', '옵션3', '옵션4'],
      };
      queryPortMock.getLastStep.mockResolvedValue(lastStep);

      // when & then
      await expect(service.submitAnswer({ sessionId, answer: '옵션5' })).rejects.toThrow(
        new RecommendSessionInvalidAnswerException(),
      );
      expect(queryPortMock.getSessionById).toHaveBeenCalledTimes(1);
      expect(queryPortMock.getSessionById).toHaveBeenCalledWith(sessionId);
      expect(queryPortMock.getLastStep).toHaveBeenCalledTimes(1);
      expect(queryPortMock.getLastStep).toHaveBeenCalledWith(sessionId);
      expect(commandPortMock.updateAnswer).not.toHaveBeenCalled();
      expect(commandPortMock.endSession).not.toHaveBeenCalled();
      expect(commandPortMock.createResult).not.toHaveBeenCalled();
    });

    it('존재하지 않는 세션에 답변을 제출하면 예외가 발생한다', async () => {
      // given
      const sessionId = 'non-existent-session';
      queryPortMock.getSessionById.mockRejectedValue(new RecommendSessionNotFoundException());

      // when & then
      await expect(service.submitAnswer({ sessionId, answer: '옵션1' })).rejects.toThrow(
        new RecommendSessionNotFoundException(),
      );
      expect(queryPortMock.getSessionById).toHaveBeenCalledTimes(1);
      expect(queryPortMock.getSessionById).toHaveBeenCalledWith(sessionId);
      expect(commandPortMock.updateAnswer).not.toHaveBeenCalled();
      expect(commandPortMock.createStep).not.toHaveBeenCalled();
      expect(commandPortMock.createResult).not.toHaveBeenCalled();
      expect(commandPortMock.endSession).not.toHaveBeenCalled();
    });

    it('이미 종료된 세션에 답변을 제출하면 예외가 발생한다', async () => {
      // given
      const sessionId = 'ended-session';
      const session: RecommendSession = {
        id: sessionId,
        steps: [],
        endedAt: new Date(),
        receiverName: 'receiverName',
      };
      queryPortMock.getSessionById.mockResolvedValue(session);

      // when & then
      await expect(service.submitAnswer({ sessionId, answer: '옵션1' })).rejects.toThrow(
        new RecommendSessionAlreadyEndedException(),
      );
      expect(queryPortMock.getSessionById).toHaveBeenCalledTimes(1);
      expect(queryPortMock.getSessionById).toHaveBeenCalledWith(sessionId);
      expect(queryPortMock.getLastStep).not.toHaveBeenCalled();
      expect(commandPortMock.updateAnswer).not.toHaveBeenCalled();
      expect(commandPortMock.endSession).not.toHaveBeenCalled();
      expect(commandPortMock.createResult).not.toHaveBeenCalled();
    });
  });

  describe('endSession', () => {
    it('세션을 종료할 수 있다', async () => {
      // given
      const sessionId = 'session-id';

      // when
      await service.endSession(sessionId);

      // then
      expect(commandPortMock.endSession).toHaveBeenCalledWith(sessionId);
    });
  });
});
