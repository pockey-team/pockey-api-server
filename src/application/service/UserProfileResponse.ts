import { User } from '../../domain/user';

export class UserProfileResponse {
  readonly id: number;
  readonly nickname: string;
  readonly profileImageUrl: string;

  constructor(user: User) {
    this.id = user.id!;
    this.nickname = user.nickname;
    this.profileImageUrl = user.profileImageUrl;
  }
}
