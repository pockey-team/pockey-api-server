export interface UserDbCommandPort {
  updateUserPassword(id: number, password: string): Promise<boolean>;
}
