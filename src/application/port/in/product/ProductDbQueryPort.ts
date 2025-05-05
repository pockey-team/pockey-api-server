import { Product } from '../../../../domain/product';

export interface ProductDbQueryPort {
  getProduct(id: number): Promise<Product>;
}
