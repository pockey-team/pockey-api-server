import { EntityManager } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { UserDbCommandPort } from 'src/application/port/out/UserDbCommandPort';

import { UserDbEntity } from './user.entity';
import { mapToUser, mapToUserDbEntity } from './user.mapper';
import { UserNotFoundException } from '../../application/common/error/exception';
import { UserDbQueryPort } from '../../application/port/out/UserDbQueryPort';
import { User } from '../../domain/user';

@Injectable()
export class UserGateway implements UserDbQueryPort, UserDbCommandPort {
  constructor(
    @InjectRepository(UserDbEntity)
    private readonly userRepository: EntityRepository<UserDbEntity>,
    private readonly em: EntityManager,
  ) {}

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new UserNotFoundException();
    }

    return mapToUser(user);
  }

  async getUserBySnsId(snsId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ snsId });
    return user ? mapToUser(user) : null;
  }

  async createUser(user: User): Promise<number> {
    const entity = mapToUserDbEntity(user);
    await this.em.persistAndFlush(entity);
    return entity.id;
  }
}
