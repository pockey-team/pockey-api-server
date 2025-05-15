import { Test, TestingModule } from '@nestjs/testing';

import { WishlistService } from './Wishlist.service';
import {
  createWishlistMock,
  wishlistGroupedMock,
  wishlistGroupedWithDeletedMock,
} from '../../__mock__/wishlist.mock';
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
          provide: 'WishlistDbCommandPort',
          useValue: {
            createWishlist: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: 'WishlistDbQueryPort',
          useValue: {
            getGroupedByReceiver: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
    queryPortMock = module.get<jest.Mocked<WishlistDbQueryPort>>('WishlistDbQueryPort');
    commandPortMock = module.get<jest.Mocked<WishlistDbCommandPort>>('WishlistDbCommandPort');
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
    it('위시리스트에서 상품을 삭제할 수 있다', async () => {
      //given
      const wishlistId = 1;

      //when
      await service.removeFromWishlist(wishlistId);

      //then
      expect(commandPortMock.removeWishlist).toHaveBeenCalledWith(wishlistId);
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
      queryPortMock.getGroupedByReceiver.mockRejectedValueOnce(wishlistGroupedWithDeletedMock);

      //when
      const result = await service.getGroupedByReceiver(userId);

      //then
      expect(result).toEqual(wishlistGroupedWithDeletedMock);
      expect(queryPortMock.getGroupedByReceiver).toHaveBeenCalledWith(userId);
    });
  });
});
