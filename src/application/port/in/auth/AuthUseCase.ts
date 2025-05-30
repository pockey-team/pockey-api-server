import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { SwaggerDto } from '../../../../common/decorators/swagger-dto.decorator';
import { IToken } from '../../../../domain/token';

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
  @IsNotEmpty()
  snsId: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  profileImageUrl: string;

  @IsOptional()
  @IsString()
  deviceId?: string;
}

@SwaggerDto()
export class CreateUserCommand {
  @IsString()
  @IsNotEmpty()
  snsId: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  profileImageUrl: string;
}

@SwaggerDto()
export class WithdrawRequest {
  @IsNotEmpty()
  @IsString()
  reason: string;
}

export class WithdrawCommand extends WithdrawRequest {
  userId: number;
}

export interface AuthUseCase {
  loginWithSocial(command: SocialLoginCommand): Promise<IToken>;
  refreshToken(command: RefreshTokenCommand): Promise<IToken>;
  withdraw(command: WithdrawCommand): Promise<void>;
}
