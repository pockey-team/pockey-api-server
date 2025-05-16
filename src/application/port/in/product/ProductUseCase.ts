import { SwaggerDto } from '../../../../common/decorators/swagger-dto.decorator';
import { Product } from '../../../../domain/product';

@SwaggerDto()
export class GetProductsQuery {
  targetGender: string[];
  ageRange: string;
  priceRange: string;
  friendshipLevel: string;
}

export interface ProductUseCase {
  getProduct(id: number): Promise<Product>;
}
