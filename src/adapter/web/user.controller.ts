import { Controller, Get, Inject, UseGuards } from '@nestjs/common';

import { UserUseCase } from '../../application/port/in/user/UserUseCase';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../../domain/user';
import { JwtAuthGuard } from '../../framework/auth/guard/jwt-auth.guard';

@Controller()
export class UserController {
  constructor(
    @Inject('UserUseCase')
    private readonly userUseCase: UserUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@GetUser() user: User): Promise<User> {
    return this.userUseCase.getUserById(user.id!);
  }
}
