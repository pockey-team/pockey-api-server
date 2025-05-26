import { GetProductsQuery } from './ProductUseCase';
import { NextPickProduct, Product, WishlistProduct } from '../../../../domain/product';

export interface ProductDbQueryPort {
  getProduct(id: number): Promise<Product>;
  getProducts(query: GetProductsQuery): Promise<Product[]>;
  getNextPicsProducts(ids: number[]): Promise<NextPickProduct[]>;
  getUniversalProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product>;
  getWishlistProductsByIds(ids: number[]): Promise<WishlistProduct[]>;
  getWishlistProductsByReceiverName(
    userId: number,
    receiverName: string,
  ): Promise<WishlistProduct[]>;
}
