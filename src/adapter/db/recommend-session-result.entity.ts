import { Entity, ManyToOne, PrimaryKey, Property, Rel } from '@mikro-orm/core';

import { RecommendSessionDbEntity } from '.';
import { ProductDbEntity } from './product.entity';

@Entity({ tableName: 'recommend_session_result' })
export class RecommendSessionResultDbEntity {
  @PrimaryKey()
  id: number;

  @Property()
  reason: string;

  @Property()
  minifiedReason: string;

  @Property()
  order: number;

  @Property({ onCreate: () => new Date() })
  createdAt: Date;

  @ManyToOne(() => RecommendSessionDbEntity)
  session: Rel<RecommendSessionDbEntity>;

  @ManyToOne(() => ProductDbEntity)
  product: Rel<ProductDbEntity>;
}
