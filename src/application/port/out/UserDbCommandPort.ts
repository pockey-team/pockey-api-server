import { User } from 'src/domain/user';

export interface UserDbCommandPort {
  createUser(user: User): Promise<number>;
}
