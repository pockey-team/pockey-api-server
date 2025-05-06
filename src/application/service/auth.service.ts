import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { comparePassword, hashPassword } from '../../domain/auth/password';
import { IToken } from '../../domain/auth/token';
import { UserRole } from '../../domain/user';
import { InvalidPasswordException, InvalidRefreshTokenException } from '../common/error/exception';
import {
  AuthUseCase,
  LoginCommand,
  RefreshTokenCommand,
  UpdatePasswordCommand,
} from '../port/in/auth/AuthUseCase';
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

  async login(command: LoginCommand): Promise<IToken> {
    const userCredential = await this.userDbQueryPort.getUserForLogin(command.email);

    const isValid = await comparePassword(command.password, userCredential.password!);
    if (!isValid) {
      throw new InvalidPasswordException();
    }

    return this.generateTokens(userCredential.id);
  }

  async refreshToken(command: RefreshTokenCommand): Promise<IToken> {
    try {
      this.jwtService.verify(command.refreshToken);
    } catch {
      throw new InvalidRefreshTokenException();
    }

    return this.generateTokens(command.userId);
  }

  async updatePassword(command: UpdatePasswordCommand): Promise<boolean> {
    const userCredential = await this.userDbQueryPort.getUserForLogin(command.email);

    const isValid = await comparePassword(command.currentPassword, userCredential.password!);
    if (!isValid) {
      throw new InvalidPasswordException();
    }

    const hashedPassword = await hashPassword(command.newPassword);
    return this.userDbCommandPort.updateUserPassword(userCredential.id, hashedPassword);
  }

  public generateTokens(userId: number): IToken {
    return {
      accessToken: this.jwtService.sign({ id: userId, role: UserRole.USER }, { expiresIn: '1h' }),
      refreshToken: this.jwtService.sign(
        { id: userId, role: UserRole.USER, refreshToken: true },
        { expiresIn: '7d' },
      ),
    };
  }
}
