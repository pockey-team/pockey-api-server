import { User } from 'src/domain/user';

import { UserDbEntity } from './user.entity';

export const mapToUser = (dbEntity: UserDbEntity): User => {
  return {
    id: dbEntity.id,
    role: dbEntity.role,
    nickname: dbEntity.nickname,
    profileImageUrl: dbEntity.profileImageUrl,
    createdAt: dbEntity.createdAt,
  };
};
