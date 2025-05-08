import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { AuthModule } from './auth.module';
import { UserDbEntity, UserGateway } from '../../adapter/db';
import { UserController } from '../../adapter/web/user.controller';
import { UserService } from '../../application/service/user.service';

@Module({
  imports: [MikroOrmModule.forFeature([UserDbEntity]), AuthModule],
  controllers: [UserController],
  providers: [
    {
      provide: 'UserUseCase',
      useClass: UserService,
    },
    {
      provide: 'UserGateway',
      useClass: UserGateway,
    },
  ],
  exports: ['UserUseCase'],
})
export class UserModule {}
