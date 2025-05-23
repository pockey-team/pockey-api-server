import { Inject, Injectable } from '@nestjs/common';
import { Wishlist, WishlistGroups, WishlistItem } from 'src/domain/wishlist';

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

  async getWishlistGroups(userId: number): Promise<WishlistGroups[]> {
    const wishlists = await this.wishlistDbQueryPort.getAllByUserId(userId);

    const groupedByReceiver = new Map<string, Wishlist[]>();
    for (const item of wishlists) {
      if (!groupedByReceiver.has(item.receiverName)) {
        groupedByReceiver.set(item.receiverName, []);
      }
      groupedByReceiver.get(item.receiverName)!.push(item);
    }

    const result: WishlistGroups[] = [];

    await Promise.all(
      Array.from(groupedByReceiver.entries()).map(async ([receiverName, items]) => {
        const productIds = items.map(w => w.productId);

        const products = await this.productDbQueryPort.getWishlistProductsByIds(productIds);

        const imageUrls = products.map(p => p.imageUrl);

        result.push({
          receiverName,
          count: items.length,
          imageUrls,
        });
      }),
    );

    return result;
  }

  async getWishlistsByReceiverName(userid: number, receiverName: string): Promise<WishlistItem[]> {
    const wishlists = await this.wishlistDbQueryPort.getByUserIdAndReceiverName(
      userid,
      receiverName,
    );
    const productIds = wishlists.map(w => w.productId);
    const products = await this.productDbQueryPort.getWishlistProductsByIds(productIds);

    return wishlists.map(item => {
      const product = products.find(p => p.id === item.productId);

      return {
        wishlistId: item.id,
        product: {
          id: item.productId,
          name: product?.name ?? null,
          price: product?.price ?? null,
          imageUrl: product?.imageUrl ?? null,
        },
        deleted: !product,
        createdAt: item.createdAt,
      };
    });
  }

  async addWishlist(command: AddWishlistCommand): Promise<void> {
    await this.wishlistDbCommandPort.addWishlist(command);
  }

  async removeWishlist(wishlistId: number, userId: number): Promise<void> {
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
