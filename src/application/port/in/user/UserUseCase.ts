import { IsDate, IsEmail, IsEnum, IsOptional } from 'class-validator';

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

export interface UserUseCase {
  getUserById(id: number): Promise<User>;
  getUsers(query: GetUsersQuery): Promise<CursorResult<UserListItem>>;
}
