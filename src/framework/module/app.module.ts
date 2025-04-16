import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, RouterModule } from '@nestjs/core';

import { AuthModule } from './auth.module';

import { UserModule } from './user.module';
import { JwtAuthGuard } from '../auth/guard';
import createMikroOrmConfig from '../config/mikro-orm.config';
import { CacheModule } from './cache.module';
import { HealthModule } from './health.module';

@Module({
  imports: [
    AuthModule,
    CacheModule,
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    UserModule,
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
