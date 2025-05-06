import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { UserSocialDbPort } from 'src/application/port/out/UserSocialDbPort';

import { UserDbEntity } from './user.entity';

@Injectable()
export class UserSocialGateway implements UserSocialDbPort {
  constructor(private readonly em: EntityManager) {}

  async findBySnsId(snsId: string): Promise<UserDbEntity | null> {
    return this.em.getRepository(UserDbEntity).findOne({ snsId });
  }

  async findByDeviceId(deviceId: string): Promise<UserDbEntity | null> {
    return this.em.getRepository(UserDbEntity).findOne({ deviceId });
  }

  async save(user: UserDbEntity): Promise<void> {
    await this.em.persistAndFlush(user);
  }
}
