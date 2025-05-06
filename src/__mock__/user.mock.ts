import { User, UserCredential, UserListItem, UserRole } from '../domain/user';

export const userMockData: Readonly<User> = {
  id: 1,
  email: 'test@test.com',
  nickname: '테스트 유저',
  role: UserRole.USER,
  createdAt: new Date('2024-01-01'),
};

export const userCredentialMockData: Readonly<UserCredential> = {
  id: 1,
  email: 'test@test.com',
  password: 'hashedPassword',
};

export const userListItemMockData: Readonly<UserListItem> = {
  id: 1,
  email: 'test@test.com',
  nickname: '테스트 유저',
  role: UserRole.USER,
  createdAt: new Date('2024-01-01'),
};
