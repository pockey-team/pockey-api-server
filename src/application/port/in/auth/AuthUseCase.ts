import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

import { SwaggerDto } from '../../../../common/decorators/swagger-dto.decorator';
import { IToken } from '../../../../domain/auth/token';

@SwaggerDto()
export class RefreshTokenCommand {
  @IsString()
  refreshToken: string;

  @IsInt()
  userId: number;
}

@SwaggerDto()
export class SocialLoginCommand {
  @IsString()
  snsId: string;

  @IsString()
  nickname: string;

  @IsString()
  profileImageUrl: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export interface AuthUseCase {
  loginWithSocial(command: SocialLoginCommand): Promise<IToken>;
  refreshToken(command: RefreshTokenCommand): Promise<IToken>;
}
