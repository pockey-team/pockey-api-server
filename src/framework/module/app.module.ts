import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, RouterModule } from '@nestjs/core';

import { AuthGuardModule } from './auth.guard.module';
import { AuthModule } from './auth.module';
import { CacheModule } from './cache.module';
import { HealthModule } from './health.module';
import { PostModule } from './post.module';
import { RecommendSessionModule } from './recommend-session.module';
import { UserModule } from './user.module';
import { JwtAuthGuard } from '../auth/guard';
import createMikroOrmConfig from '../config/mikro-orm.config';

@Module({
  imports: [
    AuthModule,
    AuthGuardModule,
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
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
