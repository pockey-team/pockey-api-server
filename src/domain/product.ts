export class Product {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
  category: string;
  brand: string;
  price: number;
  priceRange: string;
  ageRange: string;
  situation: string[];
  intention: string[];
  friendshipLevel: string[];
  targetGender: string;
  tags: string[];
  nextPickProductIds: number[];
}

export class WishlistProduct {
  id: number;
  name: string;
  imageUrl: string;
}
