import { SetMetadata } from '@nestjs/common';

export const PUBLIC_ROUTE_KEY = 'isPublicRoute';

export const Public = () => SetMetadata(PUBLIC_ROUTE_KEY, true);
