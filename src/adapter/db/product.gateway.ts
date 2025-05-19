import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { ProductDbEntity } from './product.entity';
import { mapToProduct, mapToWishlistProduct } from './product.mapper';
import { ProductNotFoundException } from '../../application/common/error/exception/product.exception';
import { ProductDbQueryPort } from '../../application/port/in/product/ProductDbQueryPort';
import { Product, WishlistProduct } from '../../domain/product';

@Injectable()
export class ProductGateway implements ProductDbQueryPort {
  constructor(
    @InjectRepository(ProductDbEntity)
    private readonly productRepository: EntityRepository<ProductDbEntity>,
  ) {}

  async getProduct(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ id });
    if (!product) {
      throw new ProductNotFoundException();
    }

    return mapToProduct(product);
  }

  async getWishlistProductsByIds(ids: number[]): Promise<WishlistProduct[]> {
    const entities = await this.productRepository.find({
      id: { $in: ids },
      deletedAt: null,
    });

    return entities.map(mapToWishlistProduct);
  }
}
