import { User } from '../../../../domain/user';

export interface UserUseCase {
  getUserById(id: number): Promise<User>;
}
