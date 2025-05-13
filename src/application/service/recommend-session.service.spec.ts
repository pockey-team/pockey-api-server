import { Test, TestingModule } from '@nestjs/testing';

import { RecommendSessionService } from './recommend-session.service';
import {
  recommendSessionMockData,
  recommendSessionResultMockData,
  recommendSessionStepMockData,
} from '../../__mock__';
import { RecommendSession, RecommendSessionStep } from '../../domain/recommend-session';
import {
  RecommendSessionNotFoundException,
  RecommendSessionAlreadyEndedException,
} from '../common/error/exception/recommend-session.exception';
import { SubmitAnswerCommand } from '../port/in/recommend-session/RecommendSessionUseCase';
import { RecommendSessionDbCommandPort } from '../port/out/RecommendSessionDbCommandPort';
import { RecommendSessionDbQueryPort } from '../port/out/RecommendSessionDbQueryPort';

describe('RecommendSessionService', () => {
  let service: RecommendSessionService;
  let queryPortMock: jest.Mocked<RecommendSessionDbQueryPort>;
  let commandPortMock: jest.Mocked<RecommendSessionDbCommandPort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendSessionService,
        {
          provide: 'RecommendSessionGateway',
          useValue: {
            getSessionById: jest.fn(),
            getLastStep: jest.fn(),
            createStep: jest.fn(),
            createResult: jest.fn(),
            updateAnswer: jest.fn(),
            endSession: jest.fn(),
            createSession: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RecommendSessionService>(RecommendSessionService);
    queryPortMock = module.get<jest.Mocked<RecommendSessionDbQueryPort>>('RecommendSessionGateway');
    commandPortMock =
      module.get<jest.Mocked<RecommendSessionDbCommandPort>>('RecommendSessionGateway');
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
      commandPortMock.createSession.mockResolvedValue(session);

      const step = recommendSessionStepMockData;
      commandPortMock.createStep.mockResolvedValue(step);

      const userId = 1;

      // when
      const result = await service.startSession(userId);

      // then
      expect(result).toEqual(step);
      expect(commandPortMock.createSession).toHaveBeenCalledWith(userId);
      expect(commandPortMock.createStep).toHaveBeenCalledWith({
        sessionId: session.id,
        question: step.question,
        options: step.options,
      });
    });
  });

  describe('submitAnswer', () => {
    it('마지막 단계가 아닐 때 답변을 제출하면 다음 단계를 반환한다', async () => {
      // given
      const session = recommendSessionMockData;
      queryPortMock.getSessionById.mockResolvedValue(session);

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
        question: '질문',
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
    });

    it('마지막 단계에서 답변을 제출하면 추천 결과를 반환한다', async () => {
      // given
      const sessionId = 'session-id';
      const session = recommendSessionMockData;
      queryPortMock.getSessionById.mockResolvedValue(session);

      const lastStep: RecommendSessionStep = {
        id: 4,
        sessionId,
        step: 4,
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
      expect(queryPortMock.getSessionById).toHaveBeenCalledWith(session.id);
      expect(queryPortMock.getLastStep).toHaveBeenCalledWith(session.id);
      expect(commandPortMock.updateAnswer).toHaveBeenCalledWith(lastStep.id, command.answer);
      expect(commandPortMock.endSession).toHaveBeenCalledWith(session.id);
      expect(commandPortMock.createResult).toHaveBeenCalledWith({
        sessionId: session.id,
        recommendProductIds: result.recommendProductIds,
        recommendText: result.recommendText,
      });
    });

    it('존재하지 않는 세션에 답변을 제출하면 예외가 발생한다', async () => {
      // given
      const sessionId = 'non-existent-session';
      queryPortMock.getSessionById.mockRejectedValue(new RecommendSessionNotFoundException());

      // when & then
      await expect(service.submitAnswer({ sessionId, answer: '옵션1' })).rejects.toThrow(
        new RecommendSessionNotFoundException(),
      );
      expect(queryPortMock.getSessionById).toHaveBeenCalledWith(sessionId);
      expect(commandPortMock.updateAnswer).not.toHaveBeenCalled();
    });

    it('이미 종료된 세션에 답변을 제출하면 예외가 발생한다', async () => {
      // given
      const sessionId = 'ended-session';
      const session: RecommendSession = {
        id: sessionId,
        steps: [],
        endedAt: new Date(),
      };
      queryPortMock.getSessionById.mockResolvedValue(session);

      // when & then
      await expect(service.submitAnswer({ sessionId, answer: '옵션1' })).rejects.toThrow(
        new RecommendSessionAlreadyEndedException(),
      );
      expect(queryPortMock.getSessionById).toHaveBeenCalledWith(sessionId);
      expect(commandPortMock.updateAnswer).not.toHaveBeenCalled();
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
