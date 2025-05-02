import { Controller, Get, Inject, Query } from '@nestjs/common';

import { CursorResult } from '../../application/common/types/CursorResult';
import { GetPostsQuery, PostUseCase } from '../../application/port/in/post/PostUseCase';
import { PostListItem } from '../../domain/post';

@Controller()
export class PostController {
  constructor(
    @Inject('PostUseCase')
    private readonly postUseCase: PostUseCase,
  ) {}

  @Get()
  async getPosts(@Query() query: GetPostsQuery): Promise<CursorResult<PostListItem>> {
    return this.postUseCase.getPosts(query);
  }
}
