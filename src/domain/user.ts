export enum UserRole {
  USER = 'USER',
}

export class User {
  constructor(
    public readonly id: number,
    public readonly nickname: string,
    public readonly profileImageUrl: string,
    public readonly role: UserRole,
    public readonly createdAt: Date,
  ) {}
}
