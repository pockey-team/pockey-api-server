import { Body, Controller, Get, Inject, Param, Patch, Query } from '@nestjs/common';

import { CursorResult } from '../../application/common/types/CursorResult';
import {
  GetUsersQuery,
  UpdateUserPasswordCommand,
  UserUseCase,
} from '../../application/port/in/user/UserUseCase';
import { User, UserListItem } from '../../domain/user';

@Controller()
export class UserController {
  constructor(
    @Inject('UserUseCase')
    private readonly userUseCase: UserUseCase,
  ) {}

  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<User> {
    return this.userUseCase.getUserById(id);
  }

  @Get()
  async getUsers(@Query() query: GetUsersQuery): Promise<CursorResult<UserListItem>> {
    return this.userUseCase.getUsers(query);
  }

  @Patch('/:userId/password')
  async updateUserPassword(
    @Param('userId') userId: string,
    @Body() body: UpdateUserPasswordCommand,
  ): Promise<boolean> {
    return this.userUseCase.updateUserPassword(userId, body);
  }
}
