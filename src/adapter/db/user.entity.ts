import { Entity, Enum, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { SoftDeletable } from 'mikro-orm-soft-delete';

import { UserRole } from '../../domain/user';

@SoftDeletable(() => UserDbEntity, 'deletedAt', () => new Date())
@Entity({ tableName: 'user' })
export class UserDbEntity {
  @PrimaryKey()
  id: number;

  @Property()
  @Unique()
  snsId: string;

  @Unique({ name: 'user_email_key' })
  @Property({ nullable: true })
  email?: string;

  @Property()
  nickname: string;

  @Property({ fieldName: 'profile_url' })
  profileImageUrl: string;

  @Enum({ items: () => UserRole })
  role: UserRole;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Property({
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdate: () => new Date(),
  })
  updatedAt?: Date;

  @Property()
  deletedAt?: Date | null;
}
