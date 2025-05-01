import { Controller, Get, Inject, Param, Query } from '@nestjs/common';

import { CursorResult } from '../../application/common/types/CursorResult';
import { GetPostsQuery, PostUseCase } from '../../application/port/in/post/PostUseCase';
import { Post, PostListItem } from '../../domain/post';

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

  @Get(':id')
  async getPost(@Param('id') id: number): Promise<Post> {
    return this.postUseCase.getPost(id);
  }
}
