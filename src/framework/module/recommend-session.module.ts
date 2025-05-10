import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { CommonQuestionDbEntity } from '../../adapter/db/common-question.entity';
import { CommonQuestionGateway } from '../../adapter/db/common-question.gateway';
import { RecommendSessionController } from '../../adapter/web/recommend-session.controller';
import { RecommendSessionService } from '../../application/service/recommend.service';

@Module({
  imports: [MikroOrmModule.forFeature([CommonQuestionDbEntity])],
  controllers: [RecommendSessionController],
  providers: [
    {
      provide: 'RecommendSessionUseCase',
      useClass: RecommendSessionService,
    },
    {
      provide: 'CommonQuestionGateway',
      useClass: CommonQuestionGateway,
    },
  ],
})
export class RecommendSessionModule {}
