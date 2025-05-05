import { Inject, Injectable } from '@nestjs/common';

import { Product } from '../../domain/product';
import { ProductDbQueryPort } from '../port/in/product/ProductDbQueryPort';
import { ProductUseCase } from '../port/in/product/ProductUseCase';

@Injectable()
export class ProductService implements ProductUseCase {
  constructor(
    @Inject('ProductGateway')
    private readonly productDbQueryPort: ProductDbQueryPort,
  ) {}

  async getProduct(id: number): Promise<Product> {
    return this.productDbQueryPort.getProduct(id);
  }
}
