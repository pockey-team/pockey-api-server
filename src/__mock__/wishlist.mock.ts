import { WishlistProduct } from 'src/domain/product';
import { Wishlist, WishlistGroups, WishlistItem } from 'src/domain/wishlist';

export const domainWishlistMockData: Wishlist = {
  id: 1,
  userId: 1,
  productId: 101,
  receiverName: '민수',
  createdAt: new Date('2025-05-21T10:00:00Z'),
};

export const wishlistProductMockData: WishlistProduct = {
  id: 101,
  name: '감성 무드등',
  url: 'https://smartstore.naver.com/coredak/products/4785024689',
  imageUrl: 'https://example.com/image.jpg',
  price: '1만원대',
};

export const wishlistGroupedMockData: WishlistGroups = {
  receiverName: '민수',
  count: 1,
  imageUrls: ['https://example.com/image.jpg'],
};

export const wishlistDetailMockData: WishlistItem = {
  wishlistId: 1,
  product: wishlistProductMockData,
  deleted: false,
};
