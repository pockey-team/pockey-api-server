import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { ProductDbEntity } from './product.entity';
import { RecommendSessionResultDbEntity } from './recommend-session-result.entity';
import { RecommendSessionStepDbEntity } from './recommend-session-step.entity';
import { RecommendSessionDbEntity } from './recommend-session.entity';
import {
  mapToRecommendSession,
  mapToRecommendSessionBaseStep,
  mapToRecommendSessionResult,
} from './recommend-session.mapper';
import { ProductNotFoundException } from '../../application/common/error/exception/product.exception';
import { StartSessionCommand } from '../../application/port/in/recommend-session/RecommendSessionUseCase';
import {
  AddStepCommand,
  CreateResultCommand,
  RecommendSessionDbCommandPort,
} from '../../application/port/out/RecommendSessionDbCommandPort';
import { RecommendSessionDbQueryPort } from '../../application/port/out/RecommendSessionDbQueryPort';
import {
  RecommendSession,
  RecommendSessionBaseStep,
  RecommendSessionResult,
} from '../../domain/recommend-session';

@Injectable()
export class RecommendSessionGateway
  implements RecommendSessionDbQueryPort, RecommendSessionDbCommandPort
{
  constructor(
    @InjectRepository(RecommendSessionDbEntity)
    private readonly sessionRepository: EntityRepository<RecommendSessionDbEntity>,
    @InjectRepository(RecommendSessionStepDbEntity)
    private readonly stepRepository: EntityRepository<RecommendSessionStepDbEntity>,
    @Inject(EntityManager)
    private readonly em: EntityManager,
  ) {}

  async getSessionById(id: string): Promise<RecommendSession> {
    const session = await this.sessionRepository.findOne(
      { id },
      { populate: ['steps', 'results'] },
    );
    if (!session) {
      throw new NotFoundException();
    }
    return mapToRecommendSession(session);
  }

  async getLastStep(sessionId: string): Promise<RecommendSessionBaseStep> {
    const stepEntity = await this.stepRepository.findOne(
      { session: { id: sessionId } },
      { orderBy: { step: 'DESC' } },
    );
    if (!stepEntity) {
      throw new NotFoundException();
    }
    return mapToRecommendSessionBaseStep(stepEntity);
  }

  async startSession(command: StartSessionCommand): Promise<RecommendSession> {
    const sessionEntity = new RecommendSessionDbEntity();
    sessionEntity.deviceId = command.deviceId;
    sessionEntity.userId = command.userId;
    sessionEntity.receiverName = command.receiverName;
    await this.em.persistAndFlush(sessionEntity);

    return mapToRecommendSession(sessionEntity);
  }

  async createStep(command: AddStepCommand): Promise<RecommendSessionBaseStep> {
    const session = await this.sessionRepository.findOne(command.sessionId, {
      populate: ['steps'],
    });
    if (!session) {
      throw new NotFoundException();
    }

    const lastStep = session.steps
      ?.getItems()
      .sort((a, b) => a.step - b.step)
      .pop();

    const stepEntity = new RecommendSessionStepDbEntity();
    stepEntity.session = session;
    stepEntity.step = lastStep ? lastStep.step + 1 : 1;
    stepEntity.question = command.question;
    stepEntity.options = command.options;

    session.steps?.add(stepEntity);
    await this.em.persistAndFlush(session);

    return mapToRecommendSessionBaseStep(stepEntity);
  }

  async createResult(command: CreateResultCommand): Promise<RecommendSessionResult[]> {
    const session = await this.sessionRepository.findOne(command.sessionId);
    if (!session) {
      throw new NotFoundException();
    }

    const results: RecommendSessionResultDbEntity[] = [];
    for (const result of command.recommendResults) {
      const product = await this.em.findOne(ProductDbEntity, { id: result.productId });
      if (!product) {
        throw new ProductNotFoundException();
      }

      const resultEntity = new RecommendSessionResultDbEntity();
      resultEntity.session = session;
      resultEntity.product = product;
      resultEntity.reason = result.reason;
      resultEntity.minifiedReason = result.minifiedReason;
      resultEntity.order = result.order;

      this.em.persist(resultEntity);
      results.push(resultEntity);
    }
    await this.em.flush();

    return results.map(mapToRecommendSessionResult);
  }

  async updateAnswer(stepId: number, answer: string): Promise<void> {
    const stepEntity = await this.stepRepository.findOne({ id: stepId });
    if (!stepEntity) {
      throw new NotFoundException();
    }
    stepEntity.answer = answer;
    await this.em.persistAndFlush(stepEntity);
  }

  async endSession(sessionId: string): Promise<void> {
    const session = await this.sessionRepository.findOne(sessionId);
    if (!session) {
      throw new NotFoundException();
    }
    session.endedAt = new Date();
    await this.em.persistAndFlush(session);
  }

  async updateSessionOwner(deviceId: string, userId: number): Promise<void> {
    const session = await this.sessionRepository.findOne({ deviceId });
    if (!session) {
      return;
    }

    session.userId = userId;
    await this.em.persistAndFlush(session);
  }
}
