import { Module } from '@nestjs/common';

import { CommonQuestionGateway } from '../../adapter/db/common-question.gateway';
import { RecommendSessionController } from '../../adapter/web/recommend-session.controller';
import { RecommendSessionService } from '../../application/service/recommend.service';

@Module({
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
