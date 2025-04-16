import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { userCredentialMockData } from '../../__mock__';
import { UserRole } from '../../domain/user';
import {
  InvalidPasswordException,
  InvalidRefreshTokenException,
  UserNotFoundException,
} from '../common/error/exception';
import { RefreshTokenCommand } from '../port/in/auth/AuthUseCase';
import { UserDbCommandPort } from '../port/out/UserDbCommandPort';
import { UserDbQueryPort } from '../port/out/UserDbQueryPort';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let queryPortMock: jest.Mocked<UserDbQueryPort>;
  let commandPortMock: jest.Mocked<UserDbCommandPort>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'UserGateway',
          useValue: {
            getUserForLogin: jest.fn(),
            updateUserPassword: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get(JwtService);
    queryPortMock = module.get<jest.Mocked<UserDbQueryPort>>('UserGateway');
    commandPortMock = module.get<jest.Mocked<UserDbCommandPort>>('UserGateway');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('비밀번호가 일치하면 로그인에 성공한다', async () => {
      // given
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('accessToken');
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('refreshToken');

      const credential = userCredentialMockData;
      queryPortMock.getUserForLogin.mockResolvedValue(credential);

      const command = { email: credential.email, password: credential.password };

      // when
      const result = await service.login(command);

      // then
      expect(result).toEqual({ accessToken: 'accessToken', refreshToken: 'refreshToken' });
      expect(queryPortMock.getUserForLogin).toHaveBeenCalledTimes(1);
      expect(queryPortMock.getUserForLogin).toHaveBeenCalledWith(command.email);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledWith(command.password, credential.password);
    });

    it('로그인에 성공하면 accessToken과 refreshToken을 반환한다', async () => {
      // given
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('accessToken');
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('refreshToken');

      const credential = userCredentialMockData;
      queryPortMock.getUserForLogin.mockResolvedValue(credential);

      const command = { email: credential.email, password: credential.password };

      // when
      const result = await service.login(command);

      // then
      expect(result).toEqual({ accessToken: 'accessToken', refreshToken: 'refreshToken' });
      expect(queryPortMock.getUserForLogin).toHaveBeenCalledTimes(1);
      expect(queryPortMock.getUserForLogin).toHaveBeenCalledWith(command.email);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledWith(command.password, credential.password);
    });

    it('로그인하려는 사용자가 존재하지 않으면 로그인에 실패한다', async () => {
      // given
      jest.spyOn(queryPortMock, 'getUserForLogin').mockRejectedValue(new UserNotFoundException());

      const credential = userCredentialMockData;
      const command = { email: credential.email, password: credential.password };

      // when & then
      await expect(service.login(command)).rejects.toThrow(new UserNotFoundException());
      expect(queryPortMock.getUserForLogin).toHaveBeenCalledTimes(1);
      expect(queryPortMock.getUserForLogin).toHaveBeenCalledWith(command.email);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('비밀번호가 일치하지 않으면 로그인에 실패한다', async () => {
      // given
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const credential = userCredentialMockData;
      queryPortMock.getUserForLogin.mockResolvedValue(credential);

      const command = { email: credential.email, password: 'wrongPassword' };

      // when & then
      await expect(service.login(command)).rejects.toThrow(new InvalidPasswordException());
      expect(queryPortMock.getUserForLogin).toHaveBeenCalledTimes(1);
      expect(queryPortMock.getUserForLogin).toHaveBeenCalledWith(command.email);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledWith(command.password, credential.password);
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('refreshToken이 유효하면 accessToken과 refreshToken을 반환한다', async () => {
      // given
      const userId = 'uuid-v7-user-id';
      jest.spyOn(jwtService, 'verify').mockReturnValueOnce({ id: userId, refreshToken: true });
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('accessToken');
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('refreshToken');

      const command: RefreshTokenCommand = { refreshToken: 'refreshToken', userId };

      // when
      const result = await service.refreshToken(command);

      // then
      expect(result).toEqual({ accessToken: 'accessToken', refreshToken: 'refreshToken' });
      expect(jwtService.verify).toHaveBeenCalledTimes(1);
      expect(jwtService.verify).toHaveBeenCalledWith(command.refreshToken);
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(jwtService.sign).toHaveBeenCalledWith(
        { id: userId, userType: UserRole.USER },
        { expiresIn: '1h' },
      );
      expect(jwtService.sign).toHaveBeenCalledWith(
        { id: userId, userType: UserRole.USER, refreshToken: true },
        { expiresIn: '7d' },
      );
    });

    it('refreshToken이 유효하지 않으면 리프레시 토큰 갱신에 실패한다', async () => {
      // given
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new JsonWebTokenError('invalid token');
      });

      const userId = 'uuid-v7-user-id';
      const command: RefreshTokenCommand = { refreshToken: 'refreshToken', userId };

      // when & then
      await expect(service.refreshToken(command)).rejects.toThrow(
        new InvalidRefreshTokenException(),
      );
      expect(jwtService.verify).toHaveBeenCalledTimes(1);
      expect(jwtService.verify).toHaveBeenCalledWith(command.refreshToken);
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('updatePassword', () => {
    it('비밀번호를 성공적으로 변경한다', async () => {
      // given
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('accessToken');
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('refreshToken');

      const credential = userCredentialMockData;
      queryPortMock.getUserForLogin.mockResolvedValue(credential);
      commandPortMock.updateUserPassword.mockResolvedValue(true);

      const command = {
        email: credential.email,
        currentPassword: credential.password,
        newPassword: 'newPassword',
      };

      // when
      const result = await service.updatePassword(command);

      // then
      expect(result).toBe(true);
      expect(queryPortMock.getUserForLogin).toHaveBeenCalledTimes(1);
      expect(queryPortMock.getUserForLogin).toHaveBeenCalledWith(command.email);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledWith(command.currentPassword, credential.password);
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      const SALT_ROUNDS = 10;
      expect(bcrypt.hash).toHaveBeenCalledWith(command.newPassword, SALT_ROUNDS);
    });

    it('비밀번호가 일치하지 않으면 비밀번호 변경에 실패한다', async () => {
      // given
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const credential = userCredentialMockData;
      queryPortMock.getUserForLogin.mockResolvedValue(credential);

      const command = {
        email: credential.email,
        currentPassword: 'wrongPassword',
        newPassword: 'newPassword',
      };

      // when & then
      await expect(service.updatePassword(command)).rejects.toThrow(new InvalidPasswordException());
      expect(queryPortMock.getUserForLogin).toHaveBeenCalledTimes(1);
      expect(queryPortMock.getUserForLogin).toHaveBeenCalledWith(command.email);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledWith(command.currentPassword, credential.password);
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });
});
