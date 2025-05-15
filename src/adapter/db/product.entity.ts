import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'product' })
export class ProductDbEntity {
  @PrimaryKey()
  id: number;

  @Property({ length: 100 })
  name: string;

  @Property({ length: 512 })
  url: string;

  @Property({ length: 512 })
  imageUrl: string;

  @Property({ length: 100 })
  category: string;

  @Property({ length: 50 })
  brand: string;

  @Property()
  price: number;

  @Property({ length: 100 })
  priceRange: string;

  @Property({ length: 100 })
  ageRange: string;

  @Property({ type: 'json' })
  situation: string[];

  @Property({ type: 'json' })
  intention: string[];

  @Property({ type: 'json' })
  friendshipLevel: string[];

  @Property({ length: 100 })
  targetGender: string;

  @Property({ type: 'json' })
  tags: string[];

  @Property({ type: 'json' })
  nextPickProductIds: number[];

  @Property({ onCreate: () => new Date() })
  createdAt: Date;

  @Property()
  deletedAt?: Date | null;
}
