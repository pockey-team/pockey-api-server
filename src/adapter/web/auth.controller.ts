import { Body, Controller, Inject, Post } from '@nestjs/common';

import { InvalidRefreshTokenException } from '../../application/common/error/exception';
import {
  AuthUseCase,
  SocialLoginCommand,
  WithdrawRequest,
} from '../../application/port/in/auth/AuthUseCase';
import { IToken } from '../../domain/token';
import { RequestInfo } from '../../framework/auth/decorator/request-info.decorator';

@Controller()
export class AuthController {
  constructor(
    @Inject('AuthUseCase')
    private readonly authUseCase: AuthUseCase,
  ) {}

  @Post('login/social')
  async loginWithSocial(@Body() body: SocialLoginCommand): Promise<IToken> {
    return this.authUseCase.loginWithSocial(body);
  }

  @Post('token/refresh')
  async refreshToken(@RequestInfo() request: RequestInfo): Promise<IToken> {
    if (!request.user?.refreshToken) {
      throw new InvalidRefreshTokenException();
    }

    return this.authUseCase.refreshToken({
      refreshToken: request.user.refreshToken,
      userId: request.user.id,
    });
  }

  @Post('withdraw')
  async withdraw(
    @RequestInfo() request: RequestInfo,
    @Body() body: WithdrawRequest,
  ): Promise<void> {
    return this.authUseCase.withdraw({
      userId: request.user.id,
      reason: body.reason,
    });
  }
}
