import { IsNumber, IsString } from 'class-validator';
import { SwaggerDto } from 'src/common/decorators/swagger-dto.decorator';
import { WishlistGroupedByReceiver } from 'src/domain/wishlist';

@SwaggerDto()
export class AddToWishlistRequest {
  @IsNumber()
  productId: number;

  @IsString()
  receiverName: string;
}

export interface AddWishlistCommand {
  userId: number;
  productId: number;
  receiverName: string;
}

export interface WishlistUseCase {
  addToWishlist(command: AddWishlistCommand): Promise<void>;
  removeFromWishlist(wishlistId: number, userId: number): Promise<void>;
  getGroupedByReceiver(userId: number): Promise<WishlistGroupedByReceiver[]>;
}
