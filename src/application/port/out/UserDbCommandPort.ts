import { CreateUser } from 'src/domain/create-user';

export interface UserDbCommandPort {
  createUser(user: CreateUser): Promise<number>;
}
