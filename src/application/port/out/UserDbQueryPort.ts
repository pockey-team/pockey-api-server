import { User, UserCredential, UserListItem } from '../../../domain/user';
import { CursorResult } from '../../common/types/CursorResult';
import { GetUsersQuery } from '../in/user/UserUseCase';

export interface UserDbQueryPort {
  getUserById(id: string): Promise<User>;
  getUserForLogin(email: string): Promise<UserCredential>;
  getUsers(query: GetUsersQuery): Promise<CursorResult<UserListItem>>;
}
