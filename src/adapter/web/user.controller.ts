import { Controller, Get, Inject, Param } from '@nestjs/common';

import { UserUseCase } from '../../application/port/in/user/UserUseCase';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../../domain/user';

@Controller()
export class UserController {
  constructor(
    @Inject('UserUseCase')
    private readonly userUseCase: UserUseCase,
  ) {}

  @Get('/:id')
  async getUser(@Param('id') id: number): Promise<User> {
    return this.userUseCase.getUserById(id);
  }

  @Get('me')
  async getMyProfile(@GetUser() user: User): Promise<User> {
    return this.userUseCase.getUserById(user.id!);
  }
}
