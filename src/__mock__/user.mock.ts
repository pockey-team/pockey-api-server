import { User, UserCredential, UserListItem, UserRole } from '../domain/user';

export const userMockData: Readonly<User> = {
  id: 'user-uuid-v7',
  email: 'test@test.com',
  firstName: '테스트',
  lastName: '유저',
  role: UserRole.USER,
  createdAt: new Date('2024-01-01'),
};

export const userCredentialMockData: Readonly<UserCredential> = {
  id: 'user-uuid-v7',
  email: 'test@test.com',
  password: 'hashedPassword',
};

export const userListItemMockData: Readonly<UserListItem> = {
  id: 'user-uuid-v7',
  email: 'test@test.com',
  firstName: '테스트',
  lastName: '유저',
  role: UserRole.USER,
  createdAt: new Date('2024-01-01'),
};
