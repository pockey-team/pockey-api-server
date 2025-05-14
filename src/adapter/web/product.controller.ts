import { Controller, Get, Inject, Param } from '@nestjs/common';

import { ProductUseCase } from '../../application/port/in/product/ProductUseCase';
import { Product } from '../../domain/product';

@Controller()
export class ProductController {
  constructor(
    @Inject('ProductUseCase')
    private readonly productUseCase: ProductUseCase,
  ) {}

  @Get(':id')
  async getProduct(@Param('id') id: number): Promise<Product> {
    return this.productUseCase.getProduct(id);
  }
}
