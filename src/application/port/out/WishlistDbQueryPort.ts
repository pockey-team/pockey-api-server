import { WishlistGroupedByReceiver } from 'src/domain/wishlist';

export interface WishlistDbQueryPort {
  getGroupedByReceiver(userId: number): Promise<WishlistGroupedByReceiver[]>;
}
