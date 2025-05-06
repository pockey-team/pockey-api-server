import { Body, Controller, Inject, Post } from '@nestjs/common';
import { SocialLoginCommand } from 'src/application/port/in/user-social/social-login.command';
import { UserSocialUseCase } from 'src/application/port/in/user-social/UserSocialUseCase';
import { IToken } from 'src/domain/auth/token';

@Controller()
export class UserSocialController {
  constructor(
    @Inject('UserSocialUseCase')
    private readonly userSocialUseCase: UserSocialUseCase,
  ) {}

  @Post('/social')
  async loginWithSocial(@Body() body: SocialLoginCommand): Promise<IToken> {
    return this.userSocialUseCase.loginWithSocial(body);
  }
}
