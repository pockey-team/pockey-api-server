import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RequireUserRoleException } from '../../../application/common/error/exception';
import { UserRole } from '../../../domain/user';
import { RequestUser } from '../decorator/request-info.decorator';
import { isPublicRoute } from '../util/guard.util';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (isPublicRoute(this.reflector, context)) {
      return true;
    }

    const user = this.getUserFromRequest(context);
    this.validateUserRole(user);

    return true;
  }

  private getUserFromRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return request.user;
  }

  private validateUserRole(user: RequestUser): void {
    if (user.role !== UserRole.USER) {
      throw new RequireUserRoleException();
    }
  }
}
