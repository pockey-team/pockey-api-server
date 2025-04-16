import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

import { ERROR_MESSAGES } from '../error-messages';

export class InsufficientPermissionException extends ForbiddenException {
  constructor(requiredPermissions?: string[]) {
    const message = requiredPermissions
      ? `${ERROR_MESSAGES.AUTH.INSUFFICIENT_PERMISSION} Required: ${requiredPermissions.join(', ')}`
      : ERROR_MESSAGES.AUTH.INSUFFICIENT_PERMISSION;

    super(message);
  }
}

export class InvalidPasswordException extends UnauthorizedException {
  constructor() {
    super(ERROR_MESSAGES.AUTH.INVALID_PASSWORD);
  }
}

export class InvalidRefreshTokenException extends UnauthorizedException {
  constructor() {
    super(ERROR_MESSAGES.AUTH.INVALID_REFRESH_TOKEN);
  }
}

export class RequireUserRoleException extends UnauthorizedException {
  constructor() {
    super(ERROR_MESSAGES.AUTH.REQUIRE_USER_ROLE);
  }
}

export class TokenExpiredException extends UnauthorizedException {
  constructor() {
    super(ERROR_MESSAGES.AUTH.TOKEN_EXPIRED);
  }
}
