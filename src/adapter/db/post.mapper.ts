import { PostDbEntity } from './post.entity';
import { Post, PostListItem } from '../../domain/post';

export const mapToPostListItem = (dbEntity: PostDbEntity): PostListItem => {
  return {
    id: dbEntity.id,
    title: dbEntity.title,
    content: dbEntity.content,
    postedAt: dbEntity.createdAt,
  };
};

export const mapToPost = (dbEntity: PostDbEntity): Post => {
  return {
    id: dbEntity.id,
    title: dbEntity.title,
    content: dbEntity.content,
    postedAt: dbEntity.createdAt,
  };
};
