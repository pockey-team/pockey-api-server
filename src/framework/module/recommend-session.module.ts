import { Module } from '@nestjs/common';

import { RecommendSessionController } from '../../adapter/web/recommend-session.controller';
import { RecommendSessionService } from '../../application/service/recommend.service';

@Module({
  controllers: [RecommendSessionController],
  providers: [
    {
      provide: 'RecommendSessionUseCase',
      useClass: RecommendSessionService,
    },
  ],
})
export class RecommendSessionModule {}
