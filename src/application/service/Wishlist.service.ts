import { Inject, Injectable } from '@nestjs/common';
import { WishlistGroups, WishlistItem } from 'src/domain/wishlist';

import { ForbiddenWishlistAccessException } from '../common/error/exception/wishlist.exception';
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

  async getWishlistGroupsByUserId(userId: number): Promise<WishlistGroups[]> {
    const wishlists = await this.wishlistDbQueryPort.getUserWishlistByUserId(userId);
    const receiverNames = wishlists.map(wishlist => wishlist.receiverName);

    return Promise.all(
      receiverNames.map(async receiverName => {
        const products = await this.productDbQueryPort.getWishlistProductsByReceiverName(
          userId,
          receiverName,
        );
        const imageUrls = products.map(p => p.imageUrl);
        return { receiverName, count: products.length, imageUrls };
      }),
    );
  }

  async getWishlistsByReceiverName(userid: number, receiverName: string): Promise<WishlistItem[]> {
    const wishlists = await this.wishlistDbQueryPort.getUserWishlistsByReceiverName(
      userid,
      receiverName,
    );
    const productIds = wishlists.map(w => w.productId);
    const products = await this.productDbQueryPort.getWishlistProductsByIds(productIds);

    return wishlists.map(item => {
      const product = products.find(p => p.id === item.productId);

      return {
        wishlistId: item.id,
        product: product
          ? {
              id: item.productId,
              name: product.name,
              price: product.price,
              imageUrl: product.imageUrl,
            }
          : null,
        deleted: !product,
      };
    });
  }

  async addWishlist(command: AddWishlistCommand): Promise<void> {
    await this.wishlistDbCommandPort.addWishlist(command);
  }

  async removeWishlist(wishlistId: number, userId: number): Promise<void> {
    const wishlist = await this.wishlistDbQueryPort.getWishlistById(wishlistId);

    if (wishlist.userId !== userId) {
      throw new ForbiddenWishlistAccessException();
    }

    await this.wishlistDbCommandPort.removeWishlist(wishlistId);
  }
}
