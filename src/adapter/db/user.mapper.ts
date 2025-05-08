import { User, UserRole } from 'src/domain/user';

import { UserDbEntity } from './user.entity';

export const mapToUser = (dbEntity: UserDbEntity): User => {
  return {
    id: dbEntity.id,
    snsId: dbEntity.snsId,
    email: dbEntity.email,
    role: dbEntity.role,
    nickname: dbEntity.nickname,
    profileImageUrl: dbEntity.profileImageUrl,
    createdAt: dbEntity.createdAt,
  };
};

export const mapToUserDbEntity = (user: User): UserDbEntity => {
  const entity = new UserDbEntity();
  entity.snsId = user.snsId;
  entity.nickname = user.nickname;
  entity.profileImageUrl = user.profileImageUrl;
  entity.email = user.email;
  entity.role = user.role ?? UserRole.USER;
  entity.createdAt = new Date();
  return entity;
};
