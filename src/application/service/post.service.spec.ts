import { Test, TestingModule } from '@nestjs/testing';

import { PostService } from './post.service';
import { postListItemMockData } from '../../__mock__/post.mock';
import { GetPostsQuery } from '../port/in/post/PostUseCase';
import { PostDbQueryPort } from '../port/out/PostDbQueryPort';

describe('PostService', () => {
  let service: PostService;
  let queryPortMock: jest.Mocked<PostDbQueryPort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: 'PostGateway',
          useValue: {
            getPosts: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    queryPortMock = module.get<jest.Mocked<PostDbQueryPort>>('PostGateway');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPosts', () => {
    it('게시글 목록을 조회할 수 있다', async () => {
      // given
      const post = postListItemMockData;
      queryPortMock.getPosts.mockResolvedValue({
        items: [post],
        nextCursor: undefined,
        hasMore: false,
      });

      const query: GetPostsQuery = {
        limit: 10,
      };

      // when
      const result = await service.getPosts(query);

      // then
      expect(result).toEqual({ items: [post], nextCursor: undefined, hasMore: false });
      expect(queryPortMock.getPosts).toHaveBeenCalledTimes(1);
      expect(queryPortMock.getPosts).toHaveBeenCalledWith(query);
    });
  });
});
