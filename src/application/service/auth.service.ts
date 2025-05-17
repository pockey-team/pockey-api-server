import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { IToken } from '../../domain/token';
import { UserRole } from '../../domain/user';
import { InvalidRefreshTokenException } from '../common/error/exception';
import {
  AuthUseCase,
  CreateUserCommand,
  RefreshTokenCommand,
  SocialLoginCommand,
} from '../port/in/auth/AuthUseCase';
import { RecommendSessionDbCommandPort } from '../port/out/RecommendSessionDbCommandPort';
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

    @Inject('RecommendSessionGateway')
    private readonly recommendSessionDbCommandPort: RecommendSessionDbCommandPort,
  ) {}

  async loginWithSocial(command: SocialLoginCommand): Promise<IToken> {
    const user = await this.userDbQueryPort.getUserBySnsId(command.snsId);

    if (user) {
      if (command.deviceId) {
        await this.recommendSessionDbCommandPort.updateSessionOwner(command.deviceId, user.id);
      }
      return this.generateTokens(user.id!);
    }

    const createUser: CreateUserCommand = {
      snsId: command.snsId,
      nickname: command.nickname,
      profileImageUrl: command.profileImageUrl,
    };

    const newUserId = await this.userDbCommandPort.createUser(createUser);

    if (command.deviceId) {
      await this.recommendSessionDbCommandPort.updateSessionOwner(command.deviceId, newUserId);
    }

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
