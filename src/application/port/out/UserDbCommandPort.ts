import { CreateUserCommand } from '../in/user/CreateUserCommand';

export interface UserDbCommandPort {
  createUser(command: CreateUserCommand): Promise<number>;
}
