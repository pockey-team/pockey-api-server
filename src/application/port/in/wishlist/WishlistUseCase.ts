import { IsNumber, IsString } from 'class-validator';
import { SwaggerDto } from 'src/common/decorators/swagger-dto.decorator';
import { WishlistGroups, WishlistItem } from 'src/domain/wishlist';

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
  getWishlistGroupsByUserId(userId: number): Promise<WishlistGroups[]>;
  getWishlistsByReceiverName(userid: number, receiverName: string): Promise<WishlistItem[]>;
  addWishlist(command: AddWishlistCommand): Promise<void>;
  removeWishlist(wishlistId: number, userId: number): Promise<void>;
}
