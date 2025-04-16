export interface UserDbCommandPort {
  updateUserPassword(id: string, password: string): Promise<boolean>;
}
