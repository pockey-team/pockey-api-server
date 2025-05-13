import { Wishlist } from 'src/domain/wishlist';

export interface CreateWishlistCommand {
  userId: number;
  productId: number;
}

export interface WishlistUseCase {
  addToWishlist(command: CreateWishlistCommand): Promise<void>;
  removeFromWishlist(wishlistId: number): Promise<void>;
  getWishlist(userId: number): Promise<Wishlist[]>;
}
