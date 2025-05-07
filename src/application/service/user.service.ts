import { Inject, Injectable } from '@nestjs/common';

import { User, UserListItem } from '../../domain/user';
import { CursorResult } from '../common/types/CursorResult';
import { GetUsersQuery, UserUseCase } from '../port/in/user/UserUseCase';
import { UserDbQueryPort } from '../port/out/UserDbQueryPort';

@Injectable()
export class UserService implements UserUseCase {
  constructor(
    @Inject('UserGateway')
    private readonly userDbQueryPort: UserDbQueryPort,
  ) {}

  async getUserById(id: number): Promise<User> {
    return this.userDbQueryPort.getUserById(id);
  }

  async getUsers(query: GetUsersQuery): Promise<CursorResult<UserListItem>> {
    return this.userDbQueryPort.getUsers(query);
  }
}
