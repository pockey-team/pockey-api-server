import { Module } from '@nestjs/common';

import { RecommendController } from '../../adapter/web/recommend.controller';
import { RecommendService } from '../../application/service/recommend.service';

@Module({
  controllers: [RecommendController],
  providers: [
    {
      provide: 'RecommendUseCase',
      useClass: RecommendService,
    },
  ],
})
export class RecommendModule {}
