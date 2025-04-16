import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, QueryBuilder } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';

import { UserDbEntity } from './user.entity';
import { mapToUser, mapToUserCredential, mapToUserListItem } from './user.mapper';
import { Order } from '../../application/common/enum/Order';
import { UserNotFoundException } from '../../application/common/error/exception';
import { CursorResult } from '../../application/common/types/CursorResult';
import { GetUsersQuery } from '../../application/port/in/user/UserUseCase';
import { UserDbCommandPort } from '../../application/port/out/UserDbCommandPort';
import { UserDbQueryPort } from '../../application/port/out/UserDbQueryPort';
import { User, UserCredential, UserListItem, UserRole } from '../../domain/user';

@Injectable()
export class UserGateway implements UserDbQueryPort, UserDbCommandPort {
  constructor(
    @InjectRepository(UserDbEntity)
    private readonly userRepository: EntityRepository<UserDbEntity>,
  ) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new UserNotFoundException();
    }

    return mapToUser(user);
  }

  async getAdminUserForLogin(email: string): Promise<UserCredential> {
    const user = await this.userRepository.findOne({ email, role: UserRole.USER });
    if (!user) {
      throw new UserNotFoundException();
    }

    return mapToUserCredential(user);
  }

  /**
   * @note 현재는 필드 기준 정렬만 지원하므로 User 타입으로 제한되어 있음
   * @note 추후 별도의 정렬 기준이 필요할 경우, SORT_OPTIONS와 같은 별도 정렬 옵션 객체를 도입하여
   *       커스텀 정렬 로직을 지원하도록 변경 필요
   */
  async getUsers(query: GetUsersQuery): Promise<CursorResult<UserListItem>> {
    const { orderBy: orderByField, order: orderDirection, limit } = query;

    const qb = this.userRepository.createQueryBuilder('user');

    qb.leftJoinAndSelect('user.userSubscription', 'userSubscription');
    qb.andWhere({ role: { $eq: UserRole.USER } });

    this.applyFilters(qb, query);

    qb.orderBy({ [orderByField.toLowerCase()]: orderDirection }).limit(limit + 1);

    const items = await qb.getResult();
    return this.processCursorPagination<UserListItem>(
      items.map(mapToUserListItem),
      limit,
      orderByField,
    );
  }

  async updateUserPassword(id: string, password: string): Promise<boolean> {
    await this.findUserOrFail(id);
    await this.userRepository.nativeUpdate({ id }, { password });
    return true;
  }

  private async findUserOrFail(userId: string): Promise<UserDbEntity> {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  private applyFilters(qb: QueryBuilder<UserDbEntity, 'user'>, query: GetUsersQuery): void {
    const {
      email,
      registeredFrom,
      registeredTo,
      orderBy: orderByField,
      order: orderDirection,
      cursor,
    } = query;

    if (email) {
      qb.andWhere({ email });
    }

    if (registeredFrom) {
      qb.andWhere({ createdAt: { $gte: registeredFrom } });
    }

    if (registeredTo) {
      qb.andWhere({ createdAt: { $lte: registeredTo } });
    }

    if (cursor) {
      const operator = orderDirection.toLowerCase() === Order.ASC ? '$gt' : '$lt';
      qb.andWhere({ [orderByField]: { [operator]: cursor } });
    }
  }

  private processCursorPagination<T extends UserListItem>(
    items: T[],
    limit: number,
    orderByField: keyof UserListItem,
  ): CursorResult<T> {
    const hasMore = items.length > limit;
    if (hasMore) {
      items.pop();
    }

    const nextCursor = hasMore ? String(items[items.length - 1][orderByField]) : undefined;
    return { items, nextCursor, hasMore };
  }
}
