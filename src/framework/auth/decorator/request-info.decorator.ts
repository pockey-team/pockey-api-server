import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserRole } from '../../../domain/user';

export interface RequestUser {
  id: number;
  role: UserRole;
  refreshToken?: string;
}

export interface RequestInfo {
  user: RequestUser;
}

export const RequestInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestInfo => {
    const request = ctx.switchToHttp().getRequest();
    return { user: request.user };
  },
);
