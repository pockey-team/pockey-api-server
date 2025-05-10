import { IsEmail, IsString } from 'class-validator';

import { SwaggerDto } from '../../../../common/decorators/swagger-dto.decorator';
import { IToken } from '../../../../domain/token';

@SwaggerDto()
export class LoginCommand {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

@SwaggerDto()
export class RefreshTokenCommand {
  @IsString()
  refreshToken: string;

  @IsString()
  userId: string;
}

export class UpdatePasswordCommand {
  @IsEmail()
  email: string;

  @IsString()
  currentPassword: string;

  @IsString()
  newPassword: string;
}

export interface AuthUseCase {
  login(command: LoginCommand): Promise<IToken>;
  refreshToken(command: RefreshTokenCommand): Promise<IToken>;
  updatePassword(command: UpdatePasswordCommand): Promise<boolean>;
}
