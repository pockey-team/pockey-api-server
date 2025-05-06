import { Test, TestingModule } from '@nestjs/testing';

import { UserSocialService } from '../service/user-social.service';

describe('UserSocialService', () => {
  let service: UserSocialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSocialService],
    }).compile();

    service = module.get<UserSocialService>(UserSocialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
