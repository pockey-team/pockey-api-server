import { Entity, OneToMany, PrimaryKey, Property, Rel } from '@mikro-orm/core';

import { RecommendSessionResultDbEntity } from './recommend-session-result.entity';

@Entity({ tableName: 'product' })
export class ProductDbEntity {
  @PrimaryKey()
  id: number;

  @Property({ length: 100 })
  name: string;

  @Property({ length: 2048 })
  url: string;

  @Property({ length: 512 })
  imageUrl: string;

  @Property({ type: 'json' })
  category: string[];

  @Property({ length: 50, nullable: true })
  brand?: string;

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
  action: string[];

  @Property({ type: 'json' })
  scene: string[];

  @Property({ type: 'json' })
  nextPickProductIds: number[];

  @Property({ type: 'boolean' })
  isUniversal: boolean;

  @Property({ onCreate: () => new Date() })
  createdAt: Date;

  @OneToMany(() => RecommendSessionResultDbEntity, result => result.product)
  results: Rel<RecommendSessionResultDbEntity>[];
}
