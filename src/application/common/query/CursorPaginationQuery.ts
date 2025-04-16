import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

import { MAX_LIMIT } from '../../../common/constant';
import { SwaggerDto } from '../../../common/decorators/swagger-dto.decorator';

@SwaggerDto()
export class CursorPaginationQuery {
  @IsOptional()
  @IsString()
  cursor?: string;

  @Max(MAX_LIMIT)
  @Min(1)
  @IsInt()
  limit: number = 20;
}
