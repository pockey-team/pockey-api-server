import { Inject, Injectable } from '@nestjs/common';
import { WishlistItem, WishlistSummary } from 'src/domain/wishlist';

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

  async getWishlistSummary(userId: number): Promise<WishlistSummary[]> {
    const wishlists = await this.wishlistDbQueryPort.getAllByUserId(userId);
    const productIds = wishlists.map(w => w.productId);

    const products = await this.productDbQueryPort.getWishlistProductsByIds(productIds);
    const productMap = new Map(products.map(p => [p.id, p]));

    const grouped = new Map<string, string[]>();

    const countMap = new Map<string, number>();

    for (const item of wishlists) {
      const product = productMap.get(item.productId);
      const imageUrl = product?.imageUrl ?? null;

      countMap.set(item.receiverName, (countMap.get(item.receiverName) ?? 0) + 1);

      if (!grouped.has(item.receiverName)) {
        grouped.set(item.receiverName, []);
      }
      if (imageUrl) {
        grouped.get(item.receiverName)!.push(imageUrl);
      }
    }

    const result: WishlistSummary[] = [];

    for (const [receiverName, imageUrls] of grouped.entries()) {
      result.push({
        receiverName,
        count: countMap.get(receiverName) ?? 0,
        imageUrls,
      });
    }

    return result;
  }

  async getWishlistByReceiver(userid: number, receiverName: string): Promise<WishlistItem[]> {
    const wishlists = await this.wishlistDbQueryPort.getByUserIdAndReceiverName(
      userid,
      receiverName,
    );
    const productIds = wishlists.map(w => w.productId);

    const products = await this.productDbQueryPort.getWishlistProductsByIds(productIds);
    const productMap = new Map(products.map(p => [p.id, p]));

    return wishlists.map(item => {
      const product = productMap.get(item.productId);

      return {
        wishlistId: item.id,
        product: {
          productId: item.productId,
          name: product?.name ?? null,
          price: product?.price ?? null,
          imageUrl: product?.imageUrl ?? null,
        },
        deleted: !product,
        createdAt: item.createdAt,
      };
    });
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
