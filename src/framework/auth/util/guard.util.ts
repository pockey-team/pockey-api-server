import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PUBLIC_ROUTE_KEY } from '../decorator/public.decorator';

export const isPublicRoute = (reflector: Reflector, context: ExecutionContext): boolean => {
  return reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);
};
