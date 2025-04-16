import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis';

import { RedisAdapter } from '../../adapter/cache/redis.adapter';
import { isProd } from '../../common/constant';

@Global()
@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: async (config: ConfigService): Promise<RedisModuleOptions> => {
        if (isProd) {
          return {
            type: 'cluster',
            nodes: [
              {
                host: config.get('REDIS_HOST'),
                port: parseInt(config.get('REDIS_PORT')!, 10),
              },
            ],
            options: {
              redisOptions: {
                password: config.get('REDIS_PASSWORD'),
              },
              enableReadyCheck: false,
              clusterRetryStrategy: (times: number) => Math.min(times * 100, 3000),
            },
          };
        } else {
          return {
            type: 'single',
            url: `redis://${config.get('REDIS_HOST')}:${config.get('REDIS_PORT')}`,
            options: {
              password: config.get('REDIS_PASSWORD'),
            },
          };
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: 'CacheAdapter',
      useClass: RedisAdapter,
    },
  ],
  exports: ['CacheAdapter'],
})
export class CacheModule {}
