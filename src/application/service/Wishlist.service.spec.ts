import { Test, TestingModule } from '@nestjs/testing';

import { WishlistService } from './Wishlist.service';
import {
  createWishlistMock,
  wishlistGroupedMock,
  wishlistGroupedWithDeletedMock,
} from '../../__mock__/wishlist.mock';
import {
  ForbiddenWishlistAccessException,
  WishlistNotFoundException,
} from '../common/error/exception/wishlist.exception';
import { WishlistDbCommandPort } from '../port/out/WishlistDbCommandPort';
import { WishlistDbQueryPort } from '../port/out/WishlistDbQueryPort';

describe('WishlistService', () => {
  let service: WishlistService;
  let queryPortMock: jest.Mocked<WishlistDbQueryPort>;
  let commandPortMock: jest.Mocked<WishlistDbCommandPort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        {
          provide: 'WishlistGateway',
          useValue: {
            addToWishlist: jest.fn(),
            removeWishlist: jest.fn(),
            getGroupedByReceiver: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
    queryPortMock = module.get<jest.Mocked<WishlistDbQueryPort>>('WishlistGateway');
    commandPortMock = module.get<jest.Mocked<WishlistDbCommandPort>>('WishlistGateway');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addToWishlist', () => {
    it('위시리스트에 상품을 추가할 수 있다', async () => {
      //given
      const command = createWishlistMock;

      //when
      await service.addToWishlist(command);

      //then
      expect(commandPortMock.addToWishlist).toHaveBeenCalledWith(command);
    });
  });

  describe('removeFromWishlist', () => {
    it('자신의 위시리스트에서 상품을 삭제할 수 있다', async () => {
      //given
      const wishlistId = 1;
      const userId = 1;

      //when
      await service.removeFromWishlist(wishlistId, userId);

      //then
      expect(commandPortMock.removeWishlist).toHaveBeenCalledWith(wishlistId, userId);
    });
    it('존재하지 않는 위시리스트 ID일 경우 예외를 던진다', async () => {
      // given
      const wishlistId = 999;
      const userId = 1;
      commandPortMock.removeWishlist.mockImplementation(() => {
        throw new WishlistNotFoundException();
      });

      // then
      await expect(service.removeFromWishlist(wishlistId, userId)).rejects.toThrow(
        WishlistNotFoundException,
      );
    });
    it('다른 사용자의 위시리스트일 경우 예외를 던진다', async () => {
      // given
      const wishlistId = 1;
      const userId = 999;
      commandPortMock.removeWishlist.mockImplementation(() => {
        throw new ForbiddenWishlistAccessException();
      });

      // then
      await expect(service.removeFromWishlist(wishlistId, userId)).rejects.toThrow(
        ForbiddenWishlistAccessException,
      );
    });
  });
  describe('getGroupedByReceiver', () => {
    it('사용자의 위시리스트 받는 사람을 기준으로 그룹화해 조회할 수 있다', async () => {
      //given
      const userId = 1;
      queryPortMock.getGroupedByReceiver.mockResolvedValueOnce(wishlistGroupedMock);

      //when
      const result = await service.getGroupedByReceiver(userId);

      //then
      expect(result).toEqual(wishlistGroupedMock);
      expect(queryPortMock.getGroupedByReceiver).toHaveBeenCalledWith(userId);
    });
    it('삭제된 상품의 경우 deleted: true로 응답해야 한다', async () => {
      //given
      const userId = 1;
      queryPortMock.getGroupedByReceiver.mockResolvedValueOnce(wishlistGroupedWithDeletedMock);

      //when
      const result = await service.getGroupedByReceiver(userId);

      //then
      expect(result).toEqual(wishlistGroupedWithDeletedMock);
      expect(queryPortMock.getGroupedByReceiver).toHaveBeenCalledWith(userId);
    });
  });
});
