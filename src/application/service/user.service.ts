import { Inject, Injectable } from '@nestjs/common';

import { hashPassword } from '../../domain/auth/password';
import { User, UserListItem } from '../../domain/user';
import { CursorResult } from '../common/types/CursorResult';
import { GetUsersQuery, UpdateUserPasswordCommand, UserUseCase } from '../port/in/user/UserUseCase';
import { UserDbCommandPort } from '../port/out/UserDbCommandPort';
import { UserDbQueryPort } from '../port/out/UserDbQueryPort';

@Injectable()
export class UserService implements UserUseCase {
  constructor(
    @Inject('UserGateway')
    private readonly userDbQueryPort: UserDbQueryPort,
    @Inject('UserGateway')
    private readonly userDbCommandPort: UserDbCommandPort,
  ) {}

  async getUserById(id: number): Promise<User> {
    return this.userDbQueryPort.getUserById(id);
  }

  async getUsers(query: GetUsersQuery): Promise<CursorResult<UserListItem>> {
    return this.userDbQueryPort.getUsers(query);
  }

  async updateUserPassword(userId: number, body: UpdateUserPasswordCommand): Promise<boolean> {
    const hashedPassword = await hashPassword(body.newPassword);
    return this.userDbCommandPort.updateUserPassword(userId, hashedPassword);
  }
}
