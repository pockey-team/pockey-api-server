import { UserDbEntity } from 'src/adapter/db';

export interface UserSocialDbPort {
  findBySnsId(snsId: string): Promise<UserDbEntity | null>;
  findByDeviceId(deviceId: string): Promise<UserDbEntity | null>;
  save(user: UserDbEntity): Promise<void>;
}
