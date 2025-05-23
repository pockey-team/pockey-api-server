import { Test, TestingModule } from '@nestjs/testing';

import { WishlistService } from './Wishlist.service';
import {
  createWishlistMock,
  domainWishlistMock,
  validWishlistProduct,
  wishlistDetailMock,
  wishlistDetailWithDeletedMock,
  wishlistGroupedMock,
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
            getByUserIdAndReceiverName: jest.fn(),
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

  describe('addWishlist', () => {
    it('위시리스트에 상품을 추가할 수 있다', async () => {
      //given
      const command = createWishlistMock;

      //when
      await service.addWishlist(command);

      //then
      expect(commandPortMock.addWishlist).toHaveBeenCalledWith(command);
    });
  });

  describe('removeWishlist', () => {
    it('자신의 위시리스트에서 상품을 삭제할 수 있다', async () => {
      //given
      queryPortMock.getWishlistById.mockResolvedValue(domainWishlistMock);

      //when
      await service.removeWishlist(domainWishlistMock.id, domainWishlistMock.userId);

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
      await expect(service.removeWishlist(wishlistId, userId)).rejects.toThrow(
        WishlistNotFoundException,
      );
    });
    it('다른 사용자의 위시리스트일 경우 예외를 던진다', async () => {
      // given
      queryPortMock.getWishlistById.mockResolvedValue({ ...domainWishlistMock, userId: 999 });

      // then
      await expect(service.removeWishlist(domainWishlistMock.id, 1)).rejects.toThrow(
        ForbiddenWishlistAccessException,
      );
    });
  });
  describe('getWishlistGroups', () => {
    it('사용자의 위시리스트 수신자 기준으로 그룹핑하여 반환할 수 있다', async () => {
      //given
      const userId = 1;
      queryPortMock.getAllByUserId.mockResolvedValueOnce([domainWishlistMock]);
      productPortMock.getWishlistProductsByIds.mockResolvedValueOnce([validWishlistProduct]);

      //when
      const result = await service.getWishlistGroups(userId);

      //then
      expect(result).toEqual(wishlistGroupedMock);
      expect(queryPortMock.getAllByUserId).toHaveBeenCalledWith(userId);
      expect(productPortMock.getWishlistProductsByIds).toHaveBeenCalledWith([101]);
    });
  });
  describe('getWishlistByReceiver', () => {
    it('receiverName으로 위시리스트 상세 목록을 반환한다', async () => {
      // given
      const userId = 1;
      const receiverName = '민수';
      queryPortMock.getByUserIdAndReceiverName.mockResolvedValueOnce([domainWishlistMock]);
      productPortMock.getWishlistProductsByIds.mockResolvedValueOnce([validWishlistProduct]);

      // when
      const result = await service.getWishlistsByReceiverName(userId, receiverName);

      // then
      expect(result).toEqual(wishlistDetailMock);
      expect(queryPortMock.getByUserIdAndReceiverName).toHaveBeenCalledWith(userId, receiverName);
      expect(productPortMock.getWishlistProductsByIds).toHaveBeenCalledWith([101]);
    });

    it('삭제된 상품이면 deleted: true로 반환한다', async () => {
      //given
      const userId = 1;
      const receiverName = '민수';
      queryPortMock.getByUserIdAndReceiverName.mockResolvedValueOnce([
        {
          id: 2,
          userId,
          productId: 999,
          receiverName,
          createdAt: new Date('2025-05-21T10:00:00Z'),
        },
      ]);
      productPortMock.getWishlistProductsByIds.mockResolvedValueOnce([]);

      //when
      const result = await service.getWishlistsByReceiverName(userId, receiverName);

      //then
      expect(result).toEqual(wishlistDetailWithDeletedMock);
      expect(queryPortMock.getByUserIdAndReceiverName).toHaveBeenCalledWith(userId, receiverName);
      expect(productPortMock.getWishlistProductsByIds).toHaveBeenCalledWith([999]);
    });
  });
});
