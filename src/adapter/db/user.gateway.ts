import { EntityManager } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { UserDbCommandPort } from 'src/application/port/out/UserDbCommandPort';
import { CreateUser } from 'src/domain/create-user';

import { UserDbEntity } from './user.entity';
import { mapToUser } from './user.mapper';
import { UserNotFoundException } from '../../application/common/error/exception';
import { UserDbQueryPort } from '../../application/port/out/UserDbQueryPort';
import { User, UserRole } from '../../domain/user';

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

  async createUser(user: CreateUser): Promise<number> {
    const entity = new UserDbEntity();
    entity.snsId = user.snsId;
    entity.nickname = user.nickname;
    entity.profileImageUrl = user.profileImageUrl;
    entity.role = UserRole.USER;

    await this.em.persistAndFlush(entity);
    return entity.id;
  }

  async removeUser(userId: number, reason: string): Promise<void> {
    await this.userRepository.nativeUpdate(
      { id: userId },
      { deletedAt: new Date(), withdrawReason: reason },
    );
  }
}
