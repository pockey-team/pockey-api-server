import { Inject, Injectable } from '@nestjs/common';
import { Wishlist } from 'src/domain/wishlist';

import { CreateWishlistCommand, WishlistUseCase } from '../port/in/wishlist/WishlistUseCase';
import { WishlistDbCommandPort } from '../port/out/WishlistDbCommandPort';
import { WishlistDbQueryPort } from '../port/out/WishlistDbQueryPort';

@Injectable()
export class WishlistService implements WishlistUseCase {
  constructor(
    @Inject('WishlistGateway')
    private readonly wishlistDbQueryPort: WishlistDbQueryPort,
    @Inject('WishlistGateway')
    private readonly wishlistDbCommandPort: WishlistDbCommandPort,
  ) {}

  async addToWishlist(command: CreateWishlistCommand): Promise<void> {
    await this.wishlistDbCommandPort.createWishlist(command);
  }

  async removeFromWishlist(wishlistId: number): Promise<void> {
    await this.wishlistDbCommandPort.remove(wishlistId);
  }

  async getWishlist(userId: number): Promise<Wishlist[]> {
    return await this.wishlistDbQueryPort.getWishlistByUserId(userId);
  }
}
