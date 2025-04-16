export enum UserRole {
  USER = 'USER',
}

export class User {
  id: string;
  email: string;
  role: UserRole;
  profileImageUrl?: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

export class UserCredential {
  id: string;
  email: string;
  password: string;
}

export class UserListItem {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  createdAt: Date;
}
