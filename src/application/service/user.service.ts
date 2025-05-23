import { Inject, Injectable } from '@nestjs/common';

import { User } from '../../domain/user';
import { UserUseCase } from '../port/in/user/UserUseCase';
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
}
