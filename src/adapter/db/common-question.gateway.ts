import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { CommonQuestionDbEntity } from './common-question.entity';
import { mapToCommonQuestion } from './common-question.mapper';
import { CommonQuestionDbQueryPort } from '../../application/port/out/CommonQuestionDbQueryPort';
import { CommonQuestion } from '../../domain/common-question';

@Injectable()
export class CommonQuestionGateway implements CommonQuestionDbQueryPort {
  constructor(
    @InjectRepository(CommonQuestionDbEntity)
    private readonly commonQuestionRepository: EntityRepository<CommonQuestionDbEntity>,
  ) {}

  async getCommonQuestionByStep(step: number): Promise<CommonQuestion | null> {
    const commonQuestion = await this.commonQuestionRepository.findOne({ step });
    return commonQuestion ? mapToCommonQuestion(commonQuestion) : null;
  }
}
