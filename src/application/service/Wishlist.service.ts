import { Inject, Injectable } from '@nestjs/common';
import { WishlistGroupedByReceiver } from 'src/domain/wishlist';

import { AddWishlistCommand, WishlistUseCase } from '../port/in/wishlist/WishlistUseCase';
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

  async addToWishlist(command: AddWishlistCommand): Promise<void> {
    await this.wishlistDbCommandPort.addToWishlist(command);
  }

  async removeFromWishlist(wishlistId: number, userId: number): Promise<void> {
    await this.wishlistDbCommandPort.removeWishlist(wishlistId, userId);
  }

  async getGroupedByReceiver(userId: number): Promise<WishlistGroupedByReceiver[]> {
    return await this.wishlistDbQueryPort.getGroupedByReceiver(userId);
  }
}
