import { User, UserRole } from '../domain/user';

export const userMockData: Readonly<User> = {
  id: 1,
  nickname: '테스트 유저',
  profileImageUrl: 'http://test.com/image.jpg',
  role: UserRole.USER,
  createdAt: new Date('2024-01-01'),
};
