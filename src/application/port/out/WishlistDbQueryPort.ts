import { Wishlist } from 'src/domain/wishlist';

export interface WishlistDbQueryPort {
  getWishlistById(wishlistId: number): Promise<Wishlist>;
  getUserWishlistByUserId(userId: number): Promise<Wishlist[]>;
  getUserWishlistsByReceiverName(userId: number, receiverName: string): Promise<Wishlist[]>;
  isInWishlist(userId: number, productId: number): Promise<boolean>;
}
