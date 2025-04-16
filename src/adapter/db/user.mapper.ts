import { User, UserCredential, UserListItem } from 'src/domain/user';

import { UserDbEntity } from './user.entity';

export const mapToUser = (dbEntity: UserDbEntity): User => {
  return {
    id: dbEntity.id,
    email: dbEntity.email,
    role: dbEntity.role,
    firstName: dbEntity.firstName,
    lastName: dbEntity.lastName,
    profileImageUrl: dbEntity.profileImageUrl,
    createdAt: dbEntity.createdAt,
  };
};

export const mapToUserCredential = (dbEntity: UserDbEntity): UserCredential => {
  return {
    id: dbEntity.id,
    email: dbEntity.email,
    password: dbEntity.password,
  };
};

export const mapToUserListItem = (dbEntity: UserDbEntity): UserListItem => {
  return {
    id: dbEntity.id,
    email: dbEntity.email,
    role: dbEntity.role,
    firstName: dbEntity.firstName,
    lastName: dbEntity.lastName,
    createdAt: dbEntity.createdAt,
  };
};
