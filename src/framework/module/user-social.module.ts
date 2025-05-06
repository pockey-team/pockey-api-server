import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserDbEntity } from 'src/adapter/db';
import { UserSocialGateway } from 'src/adapter/db/UserSocialGateway';

import { AuthModule } from './auth.module';
import { UserSocialController } from '../../adapter/web/user-social.controller';
import { UserSocialService } from '../../application/service/user-social.service';

@Module({
  imports: [MikroOrmModule.forFeature([UserDbEntity]), AuthModule],
  controllers: [UserSocialController],
  providers: [
    {
      provide: 'UserSocialUseCase',
      useClass: UserSocialService,
    },
    {
      provide: 'UserSocialGateway',
      useClass: UserSocialGateway,
    },
  ],
})
export class UserSocialModule {}
