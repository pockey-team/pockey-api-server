import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: async () => this.configService.get<string>('JWT_SECRET'),
      ignoreExpiration: false,
      algorithms: ['HS256'],
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      role: payload.role,
      nickname: payload.nickname,
      profileImageUrl: payload.profileImageUrl,
    };
  }
}
