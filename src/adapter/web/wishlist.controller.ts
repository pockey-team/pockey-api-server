import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  AddToWishlistRequest,
  AddWishlistCommand,
  WishlistUseCase,
} from 'src/application/port/in/wishlist/WishlistUseCase';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/domain/user';
import { WishlistGroupedByReceiver } from 'src/domain/wishlist';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistUseCase: WishlistUseCase) {}

  @Post()
  async addToWishlist(@Body() body: AddToWishlistRequest, @GetUser() user: User): Promise<void> {
    const command: AddWishlistCommand = {
      userId: user.id,
      productId: body.productId,
      receiverName: body.receiverName,
    };
    await this.wishlistUseCase.addToWishlist(command);
  }

  @Delete(':id')
  async removeFromWishlist(@Param('id') id: number): Promise<void> {
    await this.wishlistUseCase.removeFromWishlist(Number(id));
  }

  @Get()
  async getWishlist(@GetUser() user: User): Promise<WishlistGroupedByReceiver[]> {
    const userId = user.id;
    return this.wishlistUseCase.getGroupedByReceiver(userId);
  }
}
