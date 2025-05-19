import { Wishlist } from 'src/domain/wishlist';

export interface WishlistDbQueryPort {
  getWishlistById(wishlistId: number): Promise<Wishlist>;
  getAllByUserId(userId: number): Promise<Wishlist[]>;
}
