import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from './user.service';
import { userListItemMockData, userMockData } from '../../__mock__';
import { Order } from '../common/enum/Order';
import { UsersOrderBy } from '../port/in/user/UsersOrderBy';
import { GetUsersQuery } from '../port/in/user/UserUseCase';
import { UserDbQueryPort } from '../port/out/UserDbQueryPort';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let queryPortMock: jest.Mocked<UserDbQueryPort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'UserGateway',
          useValue: {
            getUserById: jest.fn(),
            getUsers: jest.fn(),
            updateUserPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    queryPortMock = module.get<jest.Mocked<UserDbQueryPort>>('UserGateway');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserById', () => {
    it('ID로 사용자 정보를 조회할 수 있다', async () => {
      // given
      const user = userMockData;
      queryPortMock.getUserById.mockResolvedValue(user);

      const id = 1;

      // when
      const result = await service.getUserById(id);

      // then
      expect(result).toEqual(user);
      expect(queryPortMock.getUserById).toHaveBeenCalledTimes(1);
      expect(queryPortMock.getUserById).toHaveBeenCalledWith(id);
    });
  });

  describe('getUsers', () => {
    it('사용자 목록을 조회할 수 있다', async () => {
      // given
      const user = userListItemMockData;
      queryPortMock.getUsers.mockResolvedValue({
        items: [user],
        nextCursor: undefined,
        hasMore: false,
      });

      const query: GetUsersQuery = {
        limit: 10,
        orderBy: UsersOrderBy.ID,
        order: Order.ASC,
      };

      // when
      const result = await service.getUsers(query);

      // then
      expect(result).toEqual({ items: [user], nextCursor: undefined, hasMore: false });
      expect(queryPortMock.getUsers).toHaveBeenCalledTimes(1);
      expect(queryPortMock.getUsers).toHaveBeenCalledWith(query);
    });
  });
});
