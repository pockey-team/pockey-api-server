import { ProductDbEntity } from './product.entity';
import { NextPickProduct, Product } from '../../domain/product';

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
    nextPickProducts: [],
  };
};

export const mapToNextPickProduct = (dbEntity: ProductDbEntity): NextPickProduct => {
  return {
    id: dbEntity.id,
    name: dbEntity.name,
    url: dbEntity.url,
    imageUrl: dbEntity.imageUrl,
  };
};

export const mapToWishlistProduct = (dbEntity: ProductDbEntity): WishlistProduct => {
  return {
    id: dbEntity.id,
    name: dbEntity.name,
    imageUrl: dbEntity.imageUrl,
    price: dbEntity.price,
  };
};
