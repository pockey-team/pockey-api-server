import { IToken } from 'src/domain/auth/token';

import { SocialLoginCommand } from './social-login.command';

export interface UserSocialUseCase {
  loginWithSocial(command: SocialLoginCommand): Promise<IToken>;
}
