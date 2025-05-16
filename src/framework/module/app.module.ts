import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';

import { AuthGuardModule } from './auth.guard.module';
import { AuthModule } from './auth.module';
import { CacheModule } from './cache.module';
import { HealthModule } from './health.module';
import { PostModule } from './post.module';
import { ProductModule } from './product.module';
import { RecommendSessionModule } from './recommend-session.module';
import { UserModule } from './user.module';
import createMikroOrmConfig from '../config/mikro-orm.config';

@Module({
  imports: [
    AuthModule,
    AuthGuardModule,
    CacheModule,
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    PostModule,
    ProductModule,
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
              { path: 'product', module: ProductModule },
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
