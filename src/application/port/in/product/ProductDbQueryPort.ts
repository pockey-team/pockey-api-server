import { Product, WishlistProduct } from '../../../../domain/product';

export interface ProductDbQueryPort {
  getProduct(id: number): Promise<Product>;
  getWishlistProductsByIds(ids: number[]): Promise<WishlistProduct[]>;
  getWishlistProductsByReceiverName(
    userId: number,
    receiverName: string,
  ): Promise<WishlistProduct[]>;
}
