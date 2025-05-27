import { Inject, Injectable } from '@nestjs/common';

import { Product } from '../../domain/product';
import { ProductDbQueryPort } from '../port/in/product/ProductDbQueryPort';
import { ProductUseCase } from '../port/in/product/ProductUseCase';
import { WishlistDbQueryPort } from '../port/out/WishlistDbQueryPort';

@Injectable()
export class ProductService implements ProductUseCase {
  constructor(
    @Inject('ProductGateway')
    private readonly productDbQueryPort: ProductDbQueryPort,
    @Inject('WishlistGateway')
    private readonly wishlistDbQueryPort: WishlistDbQueryPort,
  ) {}

  async getProduct(productId: number, userId: number): Promise<Product> {
    const product = await this.productDbQueryPort.getProduct(productId);

    const isMyWishlist = await this.wishlistDbQueryPort.isInWishlist(userId, productId);

    return {
      ...product,
      isMyWishlist: isMyWishlist,
    };
  }
}
