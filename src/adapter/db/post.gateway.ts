import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { PostDbEntity } from './post.entity';
import { mapToPost, mapToPostListItem } from './post.mapper';
import { Order } from '../../application/common/enum/Order';
import { PostNotFoundException } from '../../application/common/error/exception/post.exception';
import { CursorResult } from '../../application/common/types/CursorResult';
import { GetPostsQuery } from '../../application/port/in/post/PostUseCase';
import { PostDbQueryPort } from '../../application/port/out/PostDbQueryPort';
import { Post, PostListItem } from '../../domain/post';

@Injectable()
export class PostGateway implements PostDbQueryPort {
  constructor(
    @InjectRepository(PostDbEntity)
    private readonly postRepository: EntityRepository<PostDbEntity>,
  ) {}

  async getPosts(query: GetPostsQuery): Promise<CursorResult<PostListItem>> {
    const { cursor, limit } = query;

    const qb = this.postRepository.createQueryBuilder('post');

    if (cursor) {
      qb.andWhere({ id: { $lt: cursor } });
    }

    qb.orderBy({ id: Order.DESC }).limit(limit + 1);

    const items = await qb.getResult();
    return this.processCursorPagination<PostListItem>(items.map(mapToPostListItem), limit, 'id');
  }

  async getPostById(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({ id });
    if (!post) {
      throw new PostNotFoundException();
    }

    return mapToPost(post);
  }

  private processCursorPagination<T extends PostListItem>(
    items: T[],
    limit: number,
    orderByField: keyof PostListItem,
  ): CursorResult<T> {
    const hasMore = items.length > limit;
    if (hasMore) {
      items.pop();
    }

    const nextCursor = hasMore ? String(items[items.length - 1][orderByField]) : undefined;
    return { items, nextCursor, hasMore };
  }
}
