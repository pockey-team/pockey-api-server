import { Inject, Injectable } from '@nestjs/common';
import { WishlistGroupedByReceiver } from 'src/domain/wishlist';

import {
  ForbiddenWishlistAccessException,
  WishlistNotFoundException,
} from '../common/error/exception/wishlist.exception';
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

  async getGroupedByReceiver(userId: number): Promise<WishlistGroupedByReceiver[]> {
    return await this.wishlistDbQueryPort.getGroupedByReceiver(userId);
  }

  async addToWishlist(command: AddWishlistCommand): Promise<void> {
    await this.wishlistDbCommandPort.addWishlist(command);
  }

  async removeFromWishlist(wishlistId: number, userId: number): Promise<void> {
    const wishlist = await this.wishlistDbQueryPort.getWishlistById(wishlistId);

    if (!wishlist) {
      throw new WishlistNotFoundException();
    }

    if (wishlist.userId !== userId) {
      throw new ForbiddenWishlistAccessException();
    }
    await this.wishlistDbCommandPort.removeWishlist(wishlistId);
  }
}
