import { AddWishlistCommand } from '../in/wishlist/WishlistUseCase';

export interface WishlistDbCommandPort {
  addToWishlist(command: AddWishlistCommand): Promise<void>;
  removeWishlist(wishlistId: number, userId: number): Promise<void>;
}
