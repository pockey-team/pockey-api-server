import { Entity, OneToOne, PrimaryKey, Property, Rel } from '@mikro-orm/core';

import { RecommendSessionDbEntity } from '.';

@Entity({ tableName: 'recommend_session_result' })
export class RecommendSessionResultDbEntity {
  @PrimaryKey()
  id: number;

  @Property({ type: 'json' })
  recommendedProductIds: number[];

  @Property()
  recommendText: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date;

  @OneToOne(() => RecommendSessionDbEntity)
  session: Rel<RecommendSessionDbEntity>;
}
