import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { userMockData } from '../../__mock__/user.mock';
import { UserRole } from '../../domain/user';
import { InvalidRefreshTokenException } from '../common/error/exception';
import { RefreshTokenCommand, SocialLoginCommand } from '../port/in/auth/AuthUseCase';
import { RecommendSessionDbCommandPort } from '../port/out/RecommendSessionDbCommandPort';
import { UserDbCommandPort } from '../port/out/UserDbCommandPort';
import { UserDbQueryPort } from '../port/out/UserDbQueryPort';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: jest.Mocked<JwtService>;
  let queryPortMock: jest.Mocked<UserDbQueryPort>;
  let commandPortMock: jest.Mocked<UserDbCommandPort>;
  let recommendSessionCommandPortMock: jest.Mocked<RecommendSessionDbCommandPort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'UserGateway',
          useValue: {
            getUserForLogin: jest.fn(),
            getUserBySnsId: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: 'RecommendSessionGateway',
          useValue: {
            updateSessionOwner: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get(JwtService);
    queryPortMock = module.get<jest.Mocked<UserDbQueryPort>>('UserGateway');
    commandPortMock = module.get<jest.Mocked<UserDbCommandPort>>('UserGateway');
    recommendSessionCommandPortMock =
      module.get<jest.Mocked<RecommendSessionDbCommandPort>>('RecommendSessionGateway');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginWithSocial', () => {
    it('snsId로 가입한 계정이 있는 경우 로그인에 성공한다', async () => {
      // given
      const snsId = 'sns-user-1';
      queryPortMock.getUserBySnsId.mockResolvedValue(userMockData);
      jwtService.sign.mockReturnValueOnce('accessToken').mockReturnValueOnce('refreshToken');

      const command: SocialLoginCommand = {
        snsId,
        nickname: '무시될 유저',
        profileImageUrl: 'http://irrelevant.com/image.jpg',
        deviceId: undefined,
      };

      // when
      const result = await service.loginWithSocial(command);

      // then
      expect(result).toEqual({ accessToken: 'accessToken', refreshToken: 'refreshToken' });
      expect(queryPortMock.getUserBySnsId).toHaveBeenCalledTimes(1);
      expect(queryPortMock.getUserBySnsId).toHaveBeenCalledWith(snsId);
      expect(commandPortMock.createUser).not.toHaveBeenCalled();
      expect(recommendSessionCommandPortMock.updateSessionOwner).not.toHaveBeenCalled();
    });

    it('snsId로 가입한 계정이 없는 경우 회원가입에 성공한다', async () => {
      // given
      queryPortMock.getUserBySnsId.mockResolvedValueOnce(null);

      jwtService.sign.mockReturnValueOnce('accessToken').mockReturnValueOnce('refreshToken');

      const newSnsId = 'sns-new-456';

      const command: SocialLoginCommand = {
        snsId: newSnsId,
        nickname: '새로운 유저',
        profileImageUrl: 'http://new.image.jpg',
        deviceId: undefined,
      };

      // when
      const result = await service.loginWithSocial(command);

      // then
      expect(result).toEqual({ accessToken: 'accessToken', refreshToken: 'refreshToken' });

      expect(queryPortMock.getUserBySnsId).toHaveBeenCalledWith(command.snsId);
      expect(commandPortMock.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          snsId: command.snsId,
          nickname: command.nickname,
          profileImageUrl: command.profileImageUrl,
        }),
      );
      expect(recommendSessionCommandPortMock.updateSessionOwner).not.toHaveBeenCalled();
    });

    it('로그인시 deviceId가 있는 경우 세션 소유자를 업데이트한다', async () => {
      // given
      const snsId = 'sns-user-1';
      queryPortMock.getUserBySnsId.mockResolvedValue(userMockData);
      jwtService.sign.mockReturnValueOnce('accessToken').mockReturnValueOnce('refreshToken');

      const command: SocialLoginCommand = {
        snsId,
        nickname: '무시될 유저',
        profileImageUrl: 'http://irrelevant.com/image.jpg',
        deviceId: 'device-id-123',
      };

      // when
      const result = await service.loginWithSocial(command);

      // then
      expect(result).toEqual({ accessToken: 'accessToken', refreshToken: 'refreshToken' });
      expect(queryPortMock.getUserBySnsId).toHaveBeenCalledTimes(1);
      expect(queryPortMock.getUserBySnsId).toHaveBeenCalledWith(snsId);
      expect(commandPortMock.createUser).not.toHaveBeenCalled();
      expect(recommendSessionCommandPortMock.updateSessionOwner).toHaveBeenCalledWith(
        command.deviceId,
        userMockData.id,
      );
    });

    it('회원가입시 deviceId가 있는 경우 세션 소유자를 업데이트한다', async () => {
      // given
      queryPortMock.getUserBySnsId.mockResolvedValueOnce(null);

      const userId = 2;
      commandPortMock.createUser.mockResolvedValue(userId);
      jwtService.sign.mockReturnValueOnce('accessToken').mockReturnValueOnce('refreshToken');

      const newSnsId = 'sns-new-456';

      const command: SocialLoginCommand = {
        snsId: newSnsId,
        nickname: '새로운 유저',
        profileImageUrl: 'http://new.image.jpg',
        deviceId: 'device-id-123',
      };

      // when
      const result = await service.loginWithSocial(command);

      // then
      expect(result).toEqual({ accessToken: 'accessToken', refreshToken: 'refreshToken' });

      expect(queryPortMock.getUserBySnsId).toHaveBeenCalledWith(command.snsId);
      expect(commandPortMock.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          snsId: command.snsId,
          nickname: command.nickname,
          profileImageUrl: command.profileImageUrl,
        }),
      );
      expect(recommendSessionCommandPortMock.updateSessionOwner).toHaveBeenCalledWith(
        command.deviceId,
        userId,
      );
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
        { sub: userId, role: UserRole.USER },
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
