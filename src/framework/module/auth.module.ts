import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserDbEntity } from 'src/adapter/db';
import { UserGateway } from 'src/adapter/db/user.gateway';
import { AuthService } from 'src/application/service/auth.service';

import { AuthController } from '../../adapter/web/auth.controller';
import { JwtAuthGuard } from '../auth/guard';
import { JwtStrategy } from '../auth/strategy';

@Module({
  imports: [
    MikroOrmModule.forFeature([UserDbEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { algorithm: 'HS256', expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    { provide: 'AuthUseCase', useClass: AuthService },
    { provide: 'UserGateway', useClass: UserGateway },
  ],
  exports: [JwtModule, JwtAuthGuard],
})
export class AuthModule {}
