import { PostListItem } from '../../../domain/post';
import { CursorResult } from '../../common/types/CursorResult';
import { GetPostsQuery } from '../in/post/PostUseCase';

export interface PostDbQueryPort {
  getPosts(query: GetPostsQuery): Promise<CursorResult<PostListItem>>;
}
