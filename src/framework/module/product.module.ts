import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { ProductDbEntity } from '../../adapter/db/product.entity';
import { ProductGateway } from '../../adapter/db/product.gateway';
import { ProductController } from '../../adapter/web/product.controller';
import { ProductService } from '../../application/service/product.service';

@Module({
  imports: [MikroOrmModule.forFeature([ProductDbEntity])],
  controllers: [ProductController],
  providers: [
    {
      provide: 'ProductUseCase',
      useClass: ProductService,
    },
    {
      provide: 'ProductGateway',
      useClass: ProductGateway,
    },
  ],
  exports: ['ProductUseCase', 'ProductGateway'],
})
export class ProductModule {}
