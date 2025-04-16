// infrastructure/redis/redis-cache.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

import { CachePort } from '../../application/port/out/CachePort';

@Injectable()
export class RedisAdapter implements CachePort {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async get<T = any>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  async set(key: string, value: any, ttl = 0): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
