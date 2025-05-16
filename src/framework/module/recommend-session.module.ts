import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import {
  RecommendSessionDbEntity,
  RecommendSessionResultDbEntity,
  RecommendSessionStepDbEntity,
} from '../../adapter/db';
import { CommonQuestionDbEntity } from '../../adapter/db/common-question.entity';
import { CommonQuestionGateway } from '../../adapter/db/common-question.gateway';
import { ProductDbEntity } from '../../adapter/db/product.entity';
import { ProductGateway } from '../../adapter/db/product.gateway';
import { RecommendSessionGateway } from '../../adapter/db/recommend-session.gateway';
import { OpenAiClient } from '../../adapter/llm/openai.client';
import { RecommendSessionController } from '../../adapter/web/recommend-session.controller';
import { RecommendSessionService } from '../../application/service/recommend-session.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      CommonQuestionDbEntity,
      ProductDbEntity,
      RecommendSessionDbEntity,
      RecommendSessionStepDbEntity,
      RecommendSessionResultDbEntity,
    ]),
  ],
  controllers: [RecommendSessionController],
  providers: [
    OpenAiClient,
    {
      provide: 'CommonQuestionGateway',
      useClass: CommonQuestionGateway,
    },
    {
      provide: 'RecommendSessionUseCase',
      useClass: RecommendSessionService,
    },
    {
      provide: 'RecommendSessionGateway',
      useClass: RecommendSessionGateway,
    },
    {
      provide: 'ProductGateway',
      useClass: ProductGateway,
    },
  ],
})
export class RecommendSessionModule {}
