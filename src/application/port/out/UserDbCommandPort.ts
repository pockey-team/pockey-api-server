import { CreateUser } from 'src/domain/create-user';

export interface UserDbCommandPort {
  createUser(user: CreateUser): Promise<number>;
  removeUser(userId: number, reason: string): Promise<void>;
}
