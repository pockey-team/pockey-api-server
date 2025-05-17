import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import {
  RecommendSessionDbEntity,
  RecommendSessionStepDbEntity,
  UserDbEntity,
} from 'src/adapter/db';
import { UserGateway } from 'src/adapter/db/user.gateway';
import { AuthService } from 'src/application/service/auth.service';

import { RecommendSessionGateway } from '../../adapter/db/recommend-session.gateway';
import { AuthController } from '../../adapter/web/auth.controller';
import { JwtStrategy } from '../auth/strategy';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      UserDbEntity,
      RecommendSessionDbEntity,
      RecommendSessionStepDbEntity,
    ]),
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
    {
      provide: 'AuthUseCase',
      useClass: AuthService,
    },
    {
      provide: 'UserGateway',
      useClass: UserGateway,
    },
    {
      provide: 'RecommendSessionGateway',
      useClass: RecommendSessionGateway,
    },
  ],
  exports: [JwtModule],
})
export class AuthModule {}
