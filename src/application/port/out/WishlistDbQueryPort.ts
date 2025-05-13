import { Wishlist } from 'src/domain/wishlist';

export interface WishlistDbQueryPort {
  getWishlistByUserId(userId: number): Promise<Wishlist[]>;
}
