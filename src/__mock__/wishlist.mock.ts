import { AddWishlistCommand } from 'src/application/port/in/wishlist/WishlistUseCase';
import { Wishlist, WishlistItem, WishlistSummary } from 'src/domain/wishlist';

export const createWishlistMock: Readonly<AddWishlistCommand> = {
  userId: 1,
  productId: 101,
  receiverName: '민수',
};

export const wishlistGroupedMock: WishlistSummary[] = [
  {
    receiverName: '민수',
    count: 1,
    imageUrls: ['https://example.com/image.jpg'],
  },
];

export const validWishlistProduct = {
  id: 101,
  name: '감성 무드등',
  imageUrl: 'https://example.com/image.jpg',
  price: 10000,
};

export const wishlistDetailMock = [
  {
    wishlistId: 1,
    product: {
      productId: 101,
      name: '감성 무드등',
      price: 10000,
      imageUrl: 'https://example.com/image.jpg',
    },
    deleted: false,
    createdAt: new Date('2025-05-21T10:00:00Z'),
  },
];
export const wishlistDetailWithDeletedMock: WishlistItem[] = [
  {
    wishlistId: 2,
    product: {
      productId: 999,
      name: null,
      price: null,
      imageUrl: null,
    },
    deleted: true,
    createdAt: new Date('2025-05-21T10:00:00Z'),
  },
];

export const domainWishlistMock: Wishlist = {
  id: 1,
  userId: 1,
  productId: 101,
  receiverName: '민수',
  createdAt: new Date('2025-05-21T10:00:00Z'),
};
