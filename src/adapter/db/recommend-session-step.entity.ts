import { Entity, ManyToOne, PrimaryKey, Property, Rel } from '@mikro-orm/core';

import { RecommendSessionDbEntity } from '.';

@Entity({ tableName: 'recommend_session_step' })
export class RecommendSessionStepDbEntity {
  @PrimaryKey()
  id: number;

  @Property()
  step: number;

  @Property()
  question: string;

  @Property({ type: 'json' })
  options: string[];

  @Property({ type: 'json', nullable: true })
  optionImages?: string[];

  @Property({ nullable: true })
  answer?: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date;

  @Property({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => RecommendSessionDbEntity)
  session: Rel<RecommendSessionDbEntity>;
}
