import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { UsersOrderBy } from './UsersOrderBy';
import { SwaggerDto } from '../../../../common/decorators/swagger-dto.decorator';
import { User, UserListItem } from '../../../../domain/user';
import { Order } from '../../../common/enum';
import { CursorPaginationQuery } from '../../../common/query/CursorPaginationQuery';
import { CursorResult } from '../../../common/types/CursorResult';

@SwaggerDto()
export class GetUsersQuery extends CursorPaginationQuery {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDate()
  registeredFrom?: Date;

  @IsOptional()
  @IsDate()
  registeredTo?: Date;

  @IsEnum(UsersOrderBy)
  orderBy: UsersOrderBy = UsersOrderBy.ID;

  @IsEnum(Order)
  order: Order = Order.DESC;
}

@SwaggerDto()
export class UpdateUserPasswordCommand {
  @MinLength(8)
  @MaxLength(20)
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

export interface UserUseCase {
  getUserById(id: string): Promise<User>;
  getUsers(query: GetUsersQuery): Promise<CursorResult<UserListItem>>;
  updateUserPassword(userId: string, body: UpdateUserPasswordCommand): Promise<boolean>;
}
