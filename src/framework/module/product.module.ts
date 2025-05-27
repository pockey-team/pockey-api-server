import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { WishlistDbEntity } from 'src/adapter/db/wishlist.entity';
import { WishlistGateway } from 'src/adapter/db/wishlist.gateway';

import { AuthGuardModule } from './auth.guard.module';
import { ProductDbEntity } from '../../adapter/db/product.entity';
import { ProductGateway } from '../../adapter/db/product.gateway';
import { ProductController } from '../../adapter/web/product.controller';
import { ProductService } from '../../application/service/product.service';

@Module({
  imports: [MikroOrmModule.forFeature([ProductDbEntity, WishlistDbEntity]), AuthGuardModule],
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
    {
      provide: 'WishlistGateway',
      useClass: WishlistGateway,
    },
  ],
})
export class ProductModule {}
