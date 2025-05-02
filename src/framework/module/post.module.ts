import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { PostDbEntity } from '../../adapter/db/post.entity';
import { PostGateway } from '../../adapter/db/post.gateway';
import { PostController } from '../../adapter/web/post.controller';
import { PostService } from '../../application/service/post.service';

@Module({
  imports: [MikroOrmModule.forFeature([PostDbEntity])],
  controllers: [PostController],
  providers: [
    {
      provide: 'PostUseCase',
      useClass: PostService,
    },
    {
      provide: 'PostGateway',
      useClass: PostGateway,
    },
  ],
})
export class PostModule {}
