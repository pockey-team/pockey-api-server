import { Wishlist } from 'src/domain/wishlist';

import { WishlistDbEntity } from './wishlist.entity';

export const mapToWishlist = (dbEntity: WishlistDbEntity): Wishlist => {
  return {
    id: dbEntity.id,
    userId: dbEntity.userId,
    productId: dbEntity.productId,
    receiverName: dbEntity.receiverName,
    createdAt: dbEntity.createdAt,
  };
};
