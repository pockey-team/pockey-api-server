import { IsNumber, IsString } from 'class-validator';
import { SwaggerDto } from 'src/common/decorators/swagger-dto.decorator';
import { WishlistSummary } from 'src/domain/wishlist';

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
  addToWishlist(command: AddWishlistCommand): Promise<void>;
  removeFromWishlist(wishlistId: number, userId: number): Promise<void>;
}
