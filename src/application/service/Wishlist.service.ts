import { Inject, Injectable } from '@nestjs/common';
import { WishlistGroupedByReceiver, WishlistItem } from 'src/domain/wishlist';

import {
  ForbiddenWishlistAccessException,
  WishlistNotFoundException,
} from '../common/error/exception/wishlist.exception';
import { ProductDbQueryPort } from '../port/in/product/ProductDbQueryPort';
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
    @Inject('ProductGateway')
    private readonly productDbQueryPort: ProductDbQueryPort,
  ) {}

  async getGroupedByReceiver(userId: number): Promise<WishlistGroupedByReceiver[]> {
    const wishlists = await this.wishlistDbQueryPort.getAllByUserId(userId);
    const productIds = wishlists.map(w => w.productId);

    const products = await this.productDbQueryPort.getWishlistProductsByIds(productIds);
    const productMap = new Map(products.map(p => [p.id, p]));

    const grouped = new Map<string, WishlistItem[]>();

    for (const item of wishlists) {
      const product = productMap.get(item.productId);

      const dto: WishlistItem = {
        wishlistId: item.id,
        productId: item.productId,
        name: product ? product.name : null,
        imageUrl: product ? product.imageUrl : null,
        deleted: !product,
        createdAt: item.createdAt,
      };

      if (!grouped.has(item.receiverName)) {
        grouped.set(item.receiverName, []);
      }
      grouped.get(item.receiverName)!.push(dto);
    }

    return Array.from(grouped.entries()).map(([receiverName, items]) => ({
      receiverName,
      items,
    }));
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
