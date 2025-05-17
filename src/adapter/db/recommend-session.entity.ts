import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { uuidv7 } from 'uuidv7';

import { RecommendSessionResultDbEntity, RecommendSessionStepDbEntity } from '.';

@Entity({ tableName: 'recommend_session' })
export class RecommendSessionDbEntity {
  @PrimaryKey()
  id: string = uuidv7();

  @Property({ nullable: true })
  userId?: number;

  @Property()
  deviceId: string;

  @Property()
  receiverName: string;

  @Property({ nullable: true })
  endedAt?: Date;

  @Property({ onCreate: () => new Date() })
  createdAt: Date;

  @OneToMany(() => RecommendSessionStepDbEntity, entity => entity.session, { nullable: true })
  steps? = new Collection<RecommendSessionStepDbEntity>(this);

  @OneToMany(() => RecommendSessionResultDbEntity, entity => entity.session, { nullable: true })
  results? = new Collection<RecommendSessionResultDbEntity>(this);
}
