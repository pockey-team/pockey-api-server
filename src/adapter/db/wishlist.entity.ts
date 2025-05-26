import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'wishlist' })
export class WishlistDbEntity {
  @PrimaryKey()
  id: number;

  @Property()
  userId: number;

  @Property()
  productId: number;

  @Property()
  receiverName: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date;
}
