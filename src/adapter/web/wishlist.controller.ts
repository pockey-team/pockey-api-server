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
import { WishlistGroups, WishlistItem } from 'src/domain/wishlist';
import { JwtAuthGuard } from 'src/framework/auth/guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class WishlistController {
  constructor(
    @Inject('WishlistUseCase')
    private readonly wishlistUseCase: WishlistUseCase,
  ) {}

  @Post()
  async addWishlist(@Body() body: AddWishlistRequest, @GetUser() user: User): Promise<void> {
    const command: AddWishlistCommand = {
      userId: user.id,
      productId: body.productId,
      receiverName: body.receiverName,
    };
    await this.wishlistUseCase.addWishlist(command);
  }

  @Delete(':id')
  async removeWishlist(@Param('id') id: number, @GetUser() user: User): Promise<void> {
    await this.wishlistUseCase.removeWishlist(Number(id), user.id);
  }

  @Get('summary')
  async getWishlistGroups(@GetUser() user: User): Promise<WishlistGroups[]> {
    const userId = user.id;
    return this.wishlistUseCase.getWishlistGroups(userId);
  }

  @Get()
  async getWishlistsByReceiverName(
    @GetUser() user: User,
    @Query('receiverName') receiverName: string,
  ): Promise<WishlistItem[]> {
    return this.wishlistUseCase.getWishlistsByReceiverName(user.id, receiverName);
  }
}
