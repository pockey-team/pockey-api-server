export enum UserRole {
  USER = 'USER',
}

export class User {
  id: number;
  nickname: string;
  profileImageUrl: string;
  role: UserRole;
  createdAt: Date;
}
