import { Body, Controller, Delete, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import {
  AddToWishlistRequest,
  AddWishlistCommand,
  WishlistUseCase,
} from 'src/application/port/in/wishlist/WishlistUseCase';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/domain/user';
import { WishlistGroupedByReceiver } from 'src/domain/wishlist';
import { JwtAuthGuard } from 'src/framework/auth/guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class WishlistController {
  constructor(
    @Inject('WishlistUseCase')
    private readonly wishlistUseCase: WishlistUseCase,
  ) {}

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
  async removeFromWishlist(@Param('id') id: number, @GetUser() user: User): Promise<void> {
    await this.wishlistUseCase.removeFromWishlist(Number(id), user.id);
  }

  @Get()
  async getWishlist(@GetUser() user: User): Promise<WishlistGroupedByReceiver[]> {
    const userId = user.id;
    return this.wishlistUseCase.getGroupedByReceiver(userId);
  }
}
