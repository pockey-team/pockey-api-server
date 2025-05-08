import { User } from '../../../domain/user';

export interface UserDbQueryPort {
  getUserById(id: number): Promise<User>;
  getUserBySnsId(snsId: string): Promise<User | null>;
}
