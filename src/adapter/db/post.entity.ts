import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'post' })
export class PostDbEntity {
  @PrimaryKey()
  id: number;

  @Property()
  title: string;

  @Property()
  content: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date;
}
