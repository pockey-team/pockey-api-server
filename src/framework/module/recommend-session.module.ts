import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import {
  RecommendSessionDbEntity,
  RecommendSessionResultDbEntity,
  RecommendSessionStepDbEntity,
} from '../../adapter/db';
import { CommonQuestionDbEntity } from '../../adapter/db/common-question.entity';
import { CommonQuestionGateway } from '../../adapter/db/common-question.gateway';
import { RecommendSessionGateway } from '../../adapter/db/recommend-session.gateway';
import { RecommendSessionController } from '../../adapter/web/recommend-session.controller';
import { RecommendSessionService } from '../../application/service/recommend-session.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      CommonQuestionDbEntity,
      RecommendSessionDbEntity,
      RecommendSessionStepDbEntity,
      RecommendSessionResultDbEntity,
    ]),
  ],
  controllers: [RecommendSessionController],
  providers: [
    {
      provide: 'RecommendSessionUseCase',
      useClass: RecommendSessionService,
    },
    {
      provide: 'RecommendSessionGateway',
      useClass: RecommendSessionGateway,
    },
    {
      provide: 'CommonQuestionGateway',
      useClass: CommonQuestionGateway,
    },
  ],
})
export class RecommendSessionModule {}
