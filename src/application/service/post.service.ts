import { Inject, Injectable } from '@nestjs/common';

import { Post, PostListItem } from '../../domain/post';
import { CursorResult } from '../common/types/CursorResult';
import { GetPostsQuery, PostUseCase } from '../port/in/post/PostUseCase';
import { PostDbQueryPort } from '../port/out/PostDbQueryPort';

@Injectable()
export class PostService implements PostUseCase {
  constructor(
    @Inject('PostGateway')
    private readonly postDbQueryPort: PostDbQueryPort,
  ) {}

  async getPosts(query: GetPostsQuery): Promise<CursorResult<PostListItem>> {
    return this.postDbQueryPort.getPosts(query);
  }

  async getPost(id: number): Promise<Post> {
    return this.postDbQueryPort.getPostById(id);
  }
}
