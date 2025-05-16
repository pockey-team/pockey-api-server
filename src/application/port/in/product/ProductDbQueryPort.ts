import { GetProductsQuery } from './ProductUseCase';
import { Product } from '../../../../domain/product';

export interface ProductDbQueryPort {
  getProduct(id: number): Promise<Product>;
  getProducts(query: GetProductsQuery): Promise<Product[]>;
}
