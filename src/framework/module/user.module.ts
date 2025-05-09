import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { AuthGuardModule } from './auth.guard.module';
import { UserDbEntity, UserGateway } from '../../adapter/db';
import { UserController } from '../../adapter/web/user.controller';
import { UserService } from '../../application/service/user.service';

@Module({
  imports: [MikroOrmModule.forFeature([UserDbEntity]), AuthGuardModule],
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
