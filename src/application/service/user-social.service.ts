import { Inject, Injectable } from '@nestjs/common';
import { UserDbEntity } from 'src/adapter/db';
import { IToken } from 'src/domain/auth/token';
import { UserRole } from 'src/domain/user';

import { AuthService } from './auth.service';
import { SocialLoginCommand } from '../port/in/user-social/social-login.command';
import { UserSocialUseCase } from '../port/in/user-social/UserSocialUseCase';
import { UserSocialDbPort } from '../port/out/UserSocialDbPort';

@Injectable()
export class UserSocialService implements UserSocialUseCase {
  constructor(
    @Inject('UserSocialGateway')
    private readonly userSocialDbPort: UserSocialDbPort,
    private readonly authService: AuthService,
  ) {}

  async loginWithSocial(command: SocialLoginCommand): Promise<IToken> {
    let user = await this.userSocialDbPort.findBySnsId(command.snsId);

    if (!user) {
      const existingDeviceUser = await this.userSocialDbPort.findByDeviceId(command.deviceId);

      if (existingDeviceUser) {
        existingDeviceUser.snsId = command.snsId;
        existingDeviceUser.nickname = command.nickname;
        existingDeviceUser.profileImageUrl = command.profileImageUrl;
        user = existingDeviceUser;
      } else {
        user = new UserDbEntity();
        user.snsId = command.snsId;
        user.deviceId = command.deviceId;
        user.nickname = command.nickname;
        user.profileImageUrl = command.profileImageUrl;
        user.role = UserRole.USER;
        user.createdAt = new Date();
      }

      await this.userSocialDbPort.save(user);
    }

    return this.authService.generateTokens(user.id);
  }
}
