import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ProductDbEntity } from 'src/adapter/db/product.entity';
import { ProductGateway } from 'src/adapter/db/product.gateway';
import { WishlistDbEntity } from 'src/adapter/db/wishlist.entity';
import { WishlistGateway } from 'src/adapter/db/wishlist.gateway';
import { WishlistController } from 'src/adapter/web/wishlist.controller';
import { WishlistService } from 'src/application/service/Wishlist.service';

import { AuthGuardModule } from './auth.guard.module';

@Module({
  imports: [MikroOrmModule.forFeature([WishlistDbEntity, ProductDbEntity]), AuthGuardModule],
  controllers: [WishlistController],
  providers: [
    {
      provide: 'WishlistUseCase',
      useClass: WishlistService,
    },
    {
      provide: 'WishlistGateway',
      useClass: WishlistGateway,
    },
    {
      provide: 'ProductGateway',
      useClass: ProductGateway,
    },
  ],
})
export class WishlistModule {}
