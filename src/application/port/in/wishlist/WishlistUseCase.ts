import { IsNumber, IsString } from 'class-validator';
import { SwaggerDto } from 'src/common/decorators/swagger-dto.decorator';
import { WishlistItem, WishlistSummary } from 'src/domain/wishlist';

@SwaggerDto()
export class AddWishlistRequest {
  @IsNumber()
  productId: number;

  @IsString()
  receiverName: string;
}

export interface AddWishlistCommand extends AddWishlistRequest {
  userId: number;
}

export interface WishlistUseCase {
  getWishlistSummary(userId: number): Promise<WishlistSummary[]>;
  getWishlistByReceiver(userid: number, receiverName: string): Promise<WishlistItem[]>;
  addToWishlist(command: AddWishlistCommand): Promise<void>;
  removeFromWishlist(wishlistId: number, userId: number): Promise<void>;
}
