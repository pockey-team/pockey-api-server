import { AddWishlistCommand } from '../in/wishlist/WishlistUseCase';

export interface WishlistDbCommandPort {
  addWishlist(command: AddWishlistCommand): Promise<void>;
  removeWishlist(id: number): Promise<void>;
}
