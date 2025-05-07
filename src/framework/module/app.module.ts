import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';

import { AuthModule } from './auth.module';
import { CacheModule } from './cache.module';
import { HealthModule } from './health.module';
import { PostModule } from './post.module';
import { RecommendSessionModule } from './recommend-session.module';
import { UserModule } from './user.module';
import createMikroOrmConfig from '../config/mikro-orm.config';

@Module({
  imports: [
    AuthModule,
    CacheModule,
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    PostModule,
    UserModule,
    RecommendSessionModule,
    MikroOrmModule.forRootAsync({
      useFactory: async () => await createMikroOrmConfig(),
    }),
    RouterModule.register([
      {
        path: 'api',
        module: HealthModule,
        children: [
          {
            path: 'v1',
            children: [
              { path: 'auth', module: AuthModule },
              { path: 'post', module: PostModule },
              { path: 'recommend-session', module: RecommendSessionModule },
              { path: 'user', module: UserModule },
            ],
          },
        ],
      },
    ]),
  ],
})
export class AppModule {}
