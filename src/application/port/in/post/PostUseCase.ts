import { PostListItem } from 'src/domain/post';

import { SwaggerDto } from '../../../../common/decorators/swagger-dto.decorator';
import { CursorPaginationQuery } from '../../../common/query/CursorPaginationQuery';
import { CursorResult } from '../../../common/types/CursorResult';

@SwaggerDto()
export class GetPostsQuery extends CursorPaginationQuery {}

export interface PostUseCase {
  getPosts(query: GetPostsQuery): Promise<CursorResult<PostListItem>>;
}
