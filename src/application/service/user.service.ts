import { Inject, Injectable } from '@nestjs/common';

import { User } from '../../domain/user';
import { CreateUserCommand } from '../port/in/user/CreateUserCommand';
import { UserUseCase } from '../port/in/user/UserUseCase';
import { UserDbCommandPort } from '../port/out/UserDbCommandPort';
import { UserDbQueryPort } from '../port/out/UserDbQueryPort';

@Injectable()
export class UserService implements UserUseCase {
  constructor(
    @Inject('UserGateway')
    private readonly userDbCommandPort: UserDbCommandPort,
    @Inject('UserGateway')
    private readonly userDbQueryPort: UserDbQueryPort,
  ) {}

  async createUser(command: CreateUserCommand): Promise<number> {
    const user = User.createFromSocialLogin(
      command.snsId,
      command.nickname,
      command.profileImageUrl,
    );
    return this.userDbCommandPort.createUser(user);
  }

  async getUserById(id: number): Promise<User> {
    return this.userDbQueryPort.getUserById(id);
  }
}
