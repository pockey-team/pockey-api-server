import { UserDbEntity } from '../../../adapter/db/user.entity';

export interface UserDbCommandPort {
  save(user: UserDbEntity): Promise<void>;
}
