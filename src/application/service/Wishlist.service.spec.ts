import { Test, TestingModule } from '@nestjs/testing';

import { WishlistService } from './Wishlist.service';
import {
  createWishlistMock,
  domainWishlistMock,
  validWishlistItem,
  wishlistGroupedMock,
  wishlistGroupedWithDeletedMock,
} from '../../__mock__/wishlist.mock';
import {
  ForbiddenWishlistAccessException,
  WishlistNotFoundException,
} from '../common/error/exception/wishlist.exception';
import { ProductDbQueryPort } from '../port/in/product/ProductDbQueryPort';
import { WishlistDbCommandPort } from '../port/out/WishlistDbCommandPort';
import { WishlistDbQueryPort } from '../port/out/WishlistDbQueryPort';

describe('WishlistService', () => {
  let service: WishlistService;
  let queryPortMock: jest.Mocked<WishlistDbQueryPort>;
  let commandPortMock: jest.Mocked<WishlistDbCommandPort>;
  let productPortMock: jest.Mocked<ProductDbQueryPort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        {
          provide: 'WishlistGateway',
          useValue: {
            addWishlist: jest.fn(),
            removeWishlist: jest.fn(),
            getWishlistById: jest.fn(),
            getAllByUserId: jest.fn(),
          },
        },
        {
          provide: 'ProductGateway',
          useValue: {
            getWishlistProductsByIds: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
    queryPortMock = module.get<jest.Mocked<WishlistDbQueryPort>>('WishlistGateway');
    commandPortMock = module.get<jest.Mocked<WishlistDbCommandPort>>('WishlistGateway');
    productPortMock = module.get<jest.Mocked<ProductDbQueryPort>>('ProductGateway');
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
      expect(commandPortMock.addWishlist).toHaveBeenCalledWith(command);
    });
  });

  describe('removeFromWishlist', () => {
    it('자신의 위시리스트에서 상품을 삭제할 수 있다', async () => {
      //given
      queryPortMock.getWishlistById.mockResolvedValue(domainWishlistMock);

      //when
      await service.removeFromWishlist(domainWishlistMock.id, domainWishlistMock.userId);

      //then
      expect(commandPortMock.removeWishlist).toHaveBeenCalledWith(domainWishlistMock.id);
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
      queryPortMock.getWishlistById.mockResolvedValue({ ...domainWishlistMock, userId: 999 });

      // then
      await expect(service.removeFromWishlist(domainWishlistMock.id, 1)).rejects.toThrow(
        ForbiddenWishlistAccessException,
      );
    });
  });
  describe('getGroupedByReceiver', () => {
    it('사용자의 위시리스트 받는 사람을 기준으로 그룹화해 조회할 수 있다', async () => {
      //given
      const userId = 1;
      queryPortMock.getAllByUserId.mockResolvedValueOnce([domainWishlistMock]);
      productPortMock.getWishlistProductsByIds.mockResolvedValueOnce([
        {
          id: validWishlistItem.productId,
          name: validWishlistItem.name,
          imageUrl: validWishlistItem.imageUrl,
        },
      ]);

      //when
      const result = await service.getGroupedByReceiver(userId);

      //then
      expect(result).toEqual(wishlistGroupedMock);
      expect(queryPortMock.getAllByUserId).toHaveBeenCalledWith(userId);
      expect(productPortMock.getWishlistProductsByIds).toHaveBeenCalledWith([101]);
    });
    it('삭제된 상품의 경우 deleted: true로 응답해야 한다', async () => {
      //given
      const userId = 1;
      queryPortMock.getAllByUserId.mockResolvedValueOnce([
        {
          id: 2,
          userId,
          productId: 999,
          receiverName: '민수',
          createdAt: new Date('2025-05-14T12:05:00Z'),
        },
      ]);
      productPortMock.getWishlistProductsByIds.mockResolvedValueOnce([]);

      //when
      const result = await service.getGroupedByReceiver(userId);

      //then
      expect(result).toEqual(wishlistGroupedWithDeletedMock);
      expect(queryPortMock.getAllByUserId).toHaveBeenCalledWith(userId);
      expect(productPortMock.getWishlistProductsByIds).toHaveBeenCalledWith([999]);
    });
  });
});
