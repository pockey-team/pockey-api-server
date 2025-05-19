import { Wishlist, WishlistGroupedByReceiver } from 'src/domain/wishlist';

export interface WishlistDbQueryPort {
  getWishlistById(wishlistId: number): Promise<Wishlist>;
  getGroupedByReceiver(userId: number): Promise<WishlistGroupedByReceiver[]>;
}
