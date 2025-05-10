import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'common_question' })
export class CommonQuestionDbEntity {
  @PrimaryKey()
  id: number;

  @Property()
  step: number;

  @Property()
  question: string;

  @Property({ type: 'json' })
  options: string[];

  @Property({ onCreate: () => new Date() })
  createdAt: Date;
}
