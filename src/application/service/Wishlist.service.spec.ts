import { Test, TestingModule } from '@nestjs/testing';

import { WishlistService } from './Wishlist.service';
import {
  domainWishlistMockData,
  wishlistDetailMockData,
  wishlistGroupedMockData,
  wishlistProductMockData,
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
            getUserWishlistByUserId: jest.fn(),
            getUserWishlistsByReceiverName: jest.fn(),
          },
        },
        {
          provide: 'ProductGateway',
          useValue: {
            getWishlistProductsByIds: jest.fn(),
            getWishlistProductsByReceiverName: jest.fn(),
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

  describe('getWishlistGroupsByUserId', () => {
    it('사용자의 위시리스트 수신자 기준으로 그룹핑하여 반환할 수 있다', async () => {
      //given
      const userId = 1;
      const receiverName = '민수';
      queryPortMock.getUserWishlistByUserId.mockResolvedValueOnce([domainWishlistMockData]);
      productPortMock.getWishlistProductsByReceiverName.mockResolvedValueOnce([
        wishlistProductMockData,
      ]);

      //when
      const result = await service.getWishlistGroupsByUserId(userId);

      //then
      expect(result).toEqual([wishlistGroupedMockData]);
      expect(queryPortMock.getUserWishlistByUserId).toHaveBeenCalledWith(userId);
      expect(productPortMock.getWishlistProductsByReceiverName).toHaveBeenCalledWith(receiverName);
    });
  });
  describe('getWishlistsByReceiverName', () => {
    it('receiverName으로 위시리스트 상세 목록을 반환한다', async () => {
      // given
      const userId = 1;
      const productId = 101;
      const receiverName = '민수';
      queryPortMock.getUserWishlistsByReceiverName.mockResolvedValueOnce([domainWishlistMockData]);
      productPortMock.getWishlistProductsByIds.mockResolvedValueOnce([wishlistProductMockData]);

      // when
      const result = await service.getWishlistsByReceiverName(userId, receiverName);

      // then
      expect(result).toEqual([wishlistDetailMockData]);
      expect(queryPortMock.getUserWishlistsByReceiverName).toHaveBeenCalledWith(
        userId,
        receiverName,
      );
      expect(productPortMock.getWishlistProductsByIds).toHaveBeenCalledWith([productId]);
    });

    it('삭제된 상품이면 deleted: true로 반환한다', async () => {
      //given
      const userId = 1;
      const receiverName = '민수';
      queryPortMock.getUserWishlistsByReceiverName.mockResolvedValueOnce([
        {
          ...domainWishlistMockData,
          id: 2,
          productId: 999,
        },
      ]);
      productPortMock.getWishlistProductsByIds.mockResolvedValueOnce([]);

      //when
      const result = await service.getWishlistsByReceiverName(userId, receiverName);

      //then
      expect(result).toEqual([
        {
          wishlistId: 2,
          product: {
            id: 999,
            name: null,
            price: null,
            imageUrl: null,
          },
          deleted: true,
        },
      ]);

      expect(queryPortMock.getUserWishlistsByReceiverName).toHaveBeenCalledWith(
        userId,
        receiverName,
      );
      expect(productPortMock.getWishlistProductsByIds).toHaveBeenCalledWith([999]);
    });
  });

  describe('addWishlist', () => {
    it('위시리스트에 상품을 추가할 수 있다', async () => {
      //given
      const command = {
        userId: 1,
        productId: 101,
        receiverName: '민수',
      };

      //when
      await service.addWishlist(command);

      //then
      expect(commandPortMock.addWishlist).toHaveBeenCalledWith(command);
    });
  });

  describe('removeWishlist', () => {
    it('자신의 위시리스트에서 상품을 삭제할 수 있다', async () => {
      //given
      queryPortMock.getWishlistById.mockResolvedValue(domainWishlistMockData);

      //when
      await service.removeWishlist(domainWishlistMockData.id, domainWishlistMockData.userId);

      //then
      expect(commandPortMock.removeWishlist).toHaveBeenCalledWith(domainWishlistMockData.id);
      expect(commandPortMock.removeWishlist).toHaveBeenCalledTimes(1);
    });
    it('존재하지 않는 위시리스트 ID일 경우 예외를 던진다', async () => {
      // given
      const wishlistId = 999;
      const userId = 1;
      commandPortMock.removeWishlist.mockImplementation(() => {
        throw new WishlistNotFoundException();
      });

      //  when & then
      await expect(service.removeWishlist(wishlistId, userId)).rejects.toThrow(
        WishlistNotFoundException,
      );
    });
    it('다른 사용자의 위시리스트일 경우 예외를 던진다', async () => {
      // given
      const wishlistOwnerId = 999;
      queryPortMock.getWishlistById.mockResolvedValue({
        ...domainWishlistMockData,
        userId: wishlistOwnerId,
      });

      // when & then
      const requestUserId = 1;
      await expect(
        service.removeWishlist(domainWishlistMockData.id, requestUserId),
      ).rejects.toThrow(ForbiddenWishlistAccessException);
    });
  });
});
