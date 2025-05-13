import { CreateWishlistCommand } from '../in/wishlist/WishlistUseCase';

export interface WishlistDbCommandPort {
  createWishlist(command: CreateWishlistCommand): Promise<void>;
  remove(wishlistId: number): Promise<void>;
}
