export enum UserRole {
  USER = 'USER',
}

export class User {
  id?: number;
  snsId: string;
  role: UserRole;
  profileImageUrl: string;
  nickname: string;
  createdAt: Date;

  constructor(
    snsId: string,
    nickname: string,
    profileImageUrl: string,
    role: UserRole = UserRole.USER,
    createdAt: Date = new Date(),
    id?: number,
  ) {
    this.snsId = snsId;
    this.nickname = nickname;
    this.profileImageUrl = profileImageUrl;
    this.role = role;
    this.createdAt = createdAt;
    this.id = id;
  }
}
