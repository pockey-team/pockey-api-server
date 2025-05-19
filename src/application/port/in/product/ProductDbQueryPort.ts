import { GetProductsQuery } from './ProductUseCase';
import { NextPickProduct, Product } from '../../../../domain/product';

export interface ProductDbQueryPort {
  getProduct(id: number): Promise<Product>;
  getProducts(query: GetProductsQuery): Promise<Product[]>;
  getNextPicsProducts(ids: number[]): Promise<NextPickProduct[]>;
}
