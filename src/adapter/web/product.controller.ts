import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/domain/user';
import { JwtAuthGuard } from 'src/framework/auth/guard';

import { ProductUseCase } from '../../application/port/in/product/ProductUseCase';
import { Product } from '../../domain/product';

@Controller()
export class ProductController {
  constructor(
    @Inject('ProductUseCase')
    private readonly productUseCase: ProductUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProduct(@Param('id') id: number, @GetUser() user: User): Promise<Product> {
    return this.productUseCase.getProduct(id, user.id);
  }
}
