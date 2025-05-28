import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';

import { ProductDbEntity } from './product.entity';
import { mapToProduct, mapToWishlistProduct } from './product.mapper';
import { mapToNextPickProduct } from './product.mapper';
import { ProductNotFoundException } from '../../application/common/error/exception/product.exception';
import { ProductDbQueryPort } from '../../application/port/in/product/ProductDbQueryPort';
import { GetProductsQuery } from '../../application/port/in/product/ProductUseCase';
import { Product, WishlistProduct } from '../../domain/product';
import { NextPickProduct } from '../../domain/product';

@Injectable()
export class ProductGateway implements ProductDbQueryPort {
  constructor(
    @InjectRepository(ProductDbEntity)
    private readonly productRepository: EntityRepository<ProductDbEntity>,
    @Inject(EntityManager)
    private readonly em: EntityManager,
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
      priceRange: query.priceRange,
    });
    qb.andWhere('JSON_CONTAINS(product.age_range, ?)', [JSON.stringify([query.ageRange])]);
    qb.andWhere('JSON_CONTAINS(product.friendship_level, ?)', [
      JSON.stringify([query.friendshipLevel]),
    ]);

    const products = await qb.getResult();
    return products.map(mapToProduct);
  }

  async getUniversalProducts(): Promise<Product[]> {
    const products = await this.productRepository.find({ isUniversal: true });
    return products.map(mapToProduct);
  }

  async getNextPicsProducts(ids: number[]): Promise<NextPickProduct[]> {
    const products = await this.productRepository.find({ id: { $in: ids } });
    return products.map(mapToNextPickProduct);
  }

  async getWishlistProductsByIds(ids: number[]): Promise<WishlistProduct[]> {
    const entities = await this.productRepository.find({
      id: { $in: ids },
      deletedAt: null,
    });

    return entities.map(mapToWishlistProduct);
  }
}
