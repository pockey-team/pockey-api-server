import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ProductDbEntity } from 'src/adapter/db/product.entity';
import { WishlistDbEntity } from 'src/adapter/db/wishlist.entity';
import { WishlistGateway } from 'src/adapter/db/wishlist.gateway';
import { WishlistController } from 'src/adapter/web/wishlist.controller';
import { WishlistService } from 'src/application/service/Wishlist.service';

@Module({
  imports: [MikroOrmModule.forFeature([WishlistDbEntity, ProductDbEntity])],
  controllers: [WishlistController],
  providers: [
    WishlistService,
    WishlistGateway,
    {
      provide: 'WishlistUseCase',
      useClass: WishlistService,
    },
    {
      provide: 'WishlistGateway',
      useExisting: WishlistGateway,
    },
  ],
})
export class WishlistModule {}
