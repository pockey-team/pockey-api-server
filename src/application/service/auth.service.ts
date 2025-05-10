import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { IToken } from '../../domain/auth/token';
import { CreateUser } from '../../domain/create-user';
import { UserRole } from '../../domain/user';
import { InvalidRefreshTokenException } from '../common/error/exception';
import { AuthUseCase, RefreshTokenCommand, SocialLoginCommand } from '../port/in/auth/AuthUseCase';
import { UserDbCommandPort } from '../port/out/UserDbCommandPort';
import { UserDbQueryPort } from '../port/out/UserDbQueryPort';

@Injectable()
export class AuthService implements AuthUseCase {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('UserGateway')
    private readonly userDbQueryPort: UserDbQueryPort,
    @Inject('UserGateway')
    private readonly userDbCommandPort: UserDbCommandPort,
  ) {}

  async loginWithSocial(command: SocialLoginCommand): Promise<IToken> {
    const user = await this.userDbQueryPort.getUserBySnsId(command.snsId);

    if (user) {
      return this.generateTokens(user.id!);
    }

    const createUser = new CreateUser(command.snsId, command.nickname, command.profileImageUrl);

    const newUserId = await this.userDbCommandPort.createUser(createUser);
    return this.generateTokens(newUserId);
  }

  async refreshToken(command: RefreshTokenCommand): Promise<IToken> {
    try {
      this.jwtService.verify(command.refreshToken);
    } catch {
      throw new InvalidRefreshTokenException();
    }

    return this.generateTokens(command.userId);
  }

  public generateTokens(userId: number): IToken {
    return {
      accessToken: this.jwtService.sign({ sub: userId, role: UserRole.USER }, { expiresIn: '1h' }),
      refreshToken: this.jwtService.sign(
        { id: userId, role: UserRole.USER, refreshToken: true },
        { expiresIn: '7d' },
      ),
    };
  }
}
