import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import {
  CreateWishlistCommand,
  WishlistUseCase,
} from 'src/application/port/in/wishlist/WishlistUseCase';
import { Wishlist } from 'src/domain/wishlist';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistUseCase: WishlistUseCase) {}

  @Post()
  async addToWishlist(@Body() body: { productId: number }, @Req() req: any): Promise<void> {
    const command: CreateWishlistCommand = {
      userId: req.user.id,
      productId: body.productId,
    };
    await this.wishlistUseCase.addToWishlist(command);
  }

  @Delete(':id')
  async removeFromWishlist(@Param('id') id: string): Promise<void> {
    await this.wishlistUseCase.removeFromWishlist(Number(id));
  }

  @Get()
  async getWishlist(@Req() req: any): Promise<Wishlist[]> {
    return await this.wishlistUseCase.getWishlist(req.user.id);
  }
}
