export enum UserRole {
  USER = 'USER',
}

export class User {
  id: number;
  email?: string;
  role: UserRole;
  profileImageUrl?: string;
  nickname?: string;
  createdAt: Date;
}

export class UserCredential {
  id: number;
  email?: string;
  password?: string;
}

export class UserListItem {
  id: number;
  email?: string;
  role: UserRole;
  nickname?: string;
  createdAt: Date;
}
