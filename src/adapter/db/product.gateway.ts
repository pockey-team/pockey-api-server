import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { ProductDbEntity } from './product.entity';
import { mapToProduct } from './product.mapper';
import { ProductNotFoundException } from '../../application/common/error/exception/product.exception';
import { ProductDbQueryPort } from '../../application/port/in/product/ProductDbQueryPort';
import { GetProductsQuery } from '../../application/port/in/product/ProductUseCase';
import { Product } from '../../domain/product';

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

  async getProducts(query: GetProductsQuery): Promise<Product[]> {
    const qb = this.productRepository.createQueryBuilder('product');
    qb.where({
      targetGender: { $in: query.targetGender },
      ageRange: query.ageRange,
      priceRange: query.priceRange,
    });
    qb.andWhere('JSON_CONTAINS(product.friendship_level, ?)', [
      JSON.stringify([query.friendshipLevel]),
    ]);

    const products = await qb.getResult();
    return products.map(mapToProduct);
  }
}
