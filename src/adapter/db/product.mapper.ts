import { ProductDbEntity } from './product.entity';
import { Product } from '../../domain/product';

export const mapToProduct = (dbEntity: ProductDbEntity): Product => {
  return {
    id: dbEntity.id,
    name: dbEntity.name,
    url: dbEntity.url,
    imageUrl: dbEntity.imageUrl,
    category: dbEntity.category,
    brand: dbEntity.brand,
    price: dbEntity.price,
    priceRange: dbEntity.priceRange,
    ageRange: dbEntity.ageRange,
    situation: dbEntity.situation,
    intention: dbEntity.intention,
    friendshipLevel: dbEntity.friendshipLevel,
    targetGender: dbEntity.targetGender,
    tags: dbEntity.tags,
    nextPickProductIds: dbEntity.nextPickProductIds,
  };
};
