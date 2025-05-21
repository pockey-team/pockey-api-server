import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AddWishlistCommand,
  AddWishlistRequest,
  WishlistUseCase,
} from 'src/application/port/in/wishlist/WishlistUseCase';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/domain/user';
import { WishlistItem, WishlistSummary } from 'src/domain/wishlist';
import { JwtAuthGuard } from 'src/framework/auth/guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class WishlistController {
  constructor(
    @Inject('WishlistUseCase')
    private readonly wishlistUseCase: WishlistUseCase,
  ) {}

  @Post()
  async addToWishlist(@Body() body: AddWishlistRequest, @GetUser() user: User): Promise<void> {
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

  @Get('summary')
  async getWishlistSummary(@GetUser() user: User): Promise<WishlistSummary[]> {
    const userId = user.id;
    return this.wishlistUseCase.getWishlistSummary(userId);
  }

  @Get()
  async getWishlistByReceiver(
    @GetUser() user: User,
    @Query('receiverName') receiverName: string,
  ): Promise<WishlistItem[]> {
    return this.wishlistUseCase.getWishlistByReceiver(user.id, receiverName);
  }
}
