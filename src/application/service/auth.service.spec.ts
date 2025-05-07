import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDbEntity } from 'src/adapter/db';

import { AuthService } from './auth.service';
import { UserRole } from '../../domain/user';
import { InvalidRefreshTokenException } from '../common/error/exception';
import { RefreshTokenCommand, SocialLoginCommand } from '../port/in/auth/AuthUseCase';
import { UserDbCommandPort } from '../port/out/UserDbCommandPort';
import { UserDbQueryPort } from '../port/out/UserDbQueryPort';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: jest.Mocked<JwtService>;
  let queryPortMock: jest.Mocked<UserDbQueryPort>;
  let commandPortMock: jest.Mocked<UserDbCommandPort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'UserDbQueryPort',
          useExisting: 'UserGateway',
        },
        {
          provide: 'UserDbCommandPort',
          useExisting: 'UserGateway',
        },
        {
          provide: 'UserGateway',
          useValue: {
            getUserForLogin: jest.fn(),
            getUserBySnsId: jest.fn(),
            save: jest.fn(),
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

  describe('loginWithSocial', () => {
    it('기존 snsId가 있으면 토큰을 반환한다.', async () => {
      // given
      const snsId = 'sns-123';
      const user: UserDbEntity = {
        id: 1,
        snsId: 'sns-123',
        nickname: '혜원',
        profileImageUrl: 'http://...',
        role: UserRole.USER,
        createdAt: new Date(),
      };

      queryPortMock.getUserBySnsId.mockResolvedValue(user);
      jwtService.sign.mockReturnValueOnce('accessToken');
      jwtService.sign.mockReturnValueOnce('refreshToken');

      const command: SocialLoginCommand = {
        snsId,
        nickname: '혜원',
        profileImageUrl: 'http://image.jpg',
      };

      // when
      const result = await service.loginWithSocial(command);

      // then
      expect(result).toEqual({ accessToken: 'accessToken', refreshToken: 'refreshToken' });
      expect(queryPortMock.getUserBySnsId).toHaveBeenCalledWith(snsId);
      expect(commandPortMock.save).not.toHaveBeenCalled();
    });
    it('snsId가 없으면 새 유저를 생성하고 저장한 뒤 토큰을 반환한다', async () => {
      // given
      queryPortMock.getUserBySnsId.mockResolvedValue(null);
      commandPortMock.save.mockResolvedValue();

      jwtService.sign.mockReturnValueOnce('accessToken');
      jwtService.sign.mockReturnValueOnce('refreshToken');

      const command: SocialLoginCommand = {
        snsId: 'sns-456',
        nickname: '혜원',
        profileImageUrl: 'http://new-image.jpg',
      };

      // when
      const result = await service.loginWithSocial(command);

      // then
      expect(result).toEqual({ accessToken: 'accessToken', refreshToken: 'refreshToken' });
      expect(queryPortMock.getUserBySnsId).toHaveBeenCalledWith('sns-456');
      expect(commandPortMock.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('refreshToken', () => {
    it('refreshToken이 유효하면 accessToken과 refreshToken을 반환한다', async () => {
      // given
      const userId = 1;
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
        { id: userId, role: UserRole.USER },
        { expiresIn: '1h' },
      );
      expect(jwtService.sign).toHaveBeenCalledWith(
        { id: userId, role: UserRole.USER, refreshToken: true },
        { expiresIn: '7d' },
      );
    });

    it('refreshToken이 유효하지 않으면 리프레시 토큰 갱신에 실패한다', async () => {
      // given
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new JsonWebTokenError('invalid token');
      });

      const userId = 1;
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
});
