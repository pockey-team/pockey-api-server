import { User } from 'src/domain/user';

import { UserDbEntity } from './user.entity';

export const mapToUser = (dbEntity: UserDbEntity): User => {
  return {
    id: dbEntity.id,
    snsId: dbEntity.snsId,
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
  entity.role = user.role;
  return entity;
};
