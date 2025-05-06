import { Entity, Enum, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { SoftDeletable } from 'mikro-orm-soft-delete';

import { UserRole } from '../../domain/user';

@SoftDeletable(() => UserDbEntity, 'deletedAt', () => new Date())
@Entity({ tableName: 'user' })
export class UserDbEntity {
  @PrimaryKey()
  id!: number;

  @Property({ nullable: true })
  @Unique()
  snsId?: string; // 소셜 로그인 사용자 전용

  @Property({ nullable: true })
  @Unique()
  deviceId?: string; // 비로그인 사용자 전용

  @Unique({ name: 'user_email_key' })
  @Property({ nullable: true })
  email?: string;

  @Property({ hidden: true, nullable: true })
  password?: string;

  @Property({ nullable: true })
  nickname?: string;

  @Property({ nullable: true, fieldName: 'profile_url' })
  profileImageUrl?: string;

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
