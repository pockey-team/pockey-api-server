import { Product } from '../../../../domain/product';

export interface ProductUseCase {
  getProduct(id: number): Promise<Product>;
}
