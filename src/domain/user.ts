export enum UserRole {
  USER = 'USER',
}

export class User {
  id?: number;
  snsId: string;
  email?: string;
  role: UserRole;
  profileImageUrl: string;
  nickname: string;
  createdAt: Date;

  constructor(
    snsId: string,
    nickname: string,
    profileImageUrl: string,
    email?: string,
    role: UserRole = UserRole.USER,
    createdAt: Date = new Date(),
    id?: number,
  ) {
    this.snsId = snsId;
    this.nickname = nickname;
    this.profileImageUrl = profileImageUrl;
    this.email = email;
    this.role = role;
    this.createdAt = createdAt;
    this.id = id;
  }

  static createFromSocialLogin(
    snsId: string,
    nickname: string,
    profileImageUrl: string,
    email?: string,
  ): User {
    return new User(snsId, nickname, profileImageUrl, email);
  }
}
