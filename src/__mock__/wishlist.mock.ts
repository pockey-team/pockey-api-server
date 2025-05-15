import { AddWishlistCommand } from 'src/application/port/in/wishlist/WishlistUseCase';
import { WishlistGroupedByReceiver } from 'src/domain/wishlist';

export const createWishlistMock: Readonly<AddWishlistCommand> = {
  userId: 1,
  productId: 101,
  receiverName: '민수',
};

export const validWishlistItem = {
  wishlistId: 1,
  productId: 101,
  name: '감성 무드등',
  imageUrl: 'https://example.com/image.jpg',
  deleted: false,
  createdAt: new Date('2025-05-14T12:00:00Z'),
};

export const deletedWishlistItem = {
  wishlistId: 2,
  productId: 999,
  name: null,
  imageUrl: null,
  deleted: true,
  createdAt: new Date('2025-05-14T12:05:00Z'),
};
export const wishlistGroupedMock: WishlistGroupedByReceiver[] = [
  {
    receiverName: '민수',
    items: [validWishlistItem],
  },
];
export const wishlistGroupedWithDeletedMock: WishlistGroupedByReceiver[] = [
  {
    receiverName: '민수',
    items: [deletedWishlistItem],
  },
];
