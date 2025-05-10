export class CreateUser {
  constructor(
    public readonly snsId: string,
    public readonly nickname: string,
    public readonly profileImageUrl: string,
  ) {}
}
