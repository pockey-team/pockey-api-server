import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';

import { UserUseCase } from '../../application/port/in/user/UserUseCase';
import { UserProfileResponse } from '../../application/service/UserProfileResponse';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../../domain/user';
import { JwtAuthGuard } from '../../framework/auth/guard/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@GetUser() user: User): Promise<UserProfileResponse> {
    const fulluser = await this.userUseCase.getUserById(user.id!);
    return new UserProfileResponse(fulluser);
  }
}
