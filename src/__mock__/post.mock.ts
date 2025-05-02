import { Post, PostListItem } from '../domain/post';

export const postListItemMockData: Readonly<PostListItem> = {
  id: 1,
  title: '게시글 제목',
  content: '게시글 내용',
  postedAt: new Date('2024-01-01'),
};

export const postMockData: Readonly<Post> = {
  id: 1,
  title: '게시글 제목',
  content: '게시글 내용',
  postedAt: new Date('2024-01-01'),
};
