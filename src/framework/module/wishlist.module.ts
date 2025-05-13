import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { WishlistDbEntity } from 'src/adapter/db/wishlist.entity';
import { WishlistGateway } from 'src/adapter/db/wishlist.gateway';
import { WishlistController } from 'src/adapter/web/wishlist.controller';
import { WishlistService } from 'src/application/service/Wishlist.service';

@Module({
  imports: [MikroOrmModule.forFeature([WishlistDbEntity])],
  controllers: [WishlistController],
  providers: [
    WishlistService,
    WishlistGateway,
    {
      provide: 'WishlistGateway',
      useExisting: WishlistGateway,
    },
  ],
})
export class WishlistModule {}
