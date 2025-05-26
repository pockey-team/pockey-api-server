import { Wishlist } from 'src/domain/wishlist';

export interface WishlistDbQueryPort {
  getWishlistById(wishlistId: number): Promise<Wishlist>;
  getUserWishlistByUserId(userId: number): Promise<Wishlist[]>;
  getByUserIdAndReceiverName(userId: number, receiverName: string): Promise<Wishlist[]>;
}
