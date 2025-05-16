import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { ERROR_MESSAGES } from '../error-messages';

export class WishlistNotFoundException extends NotFoundException {
  constructor() {
    super(ERROR_MESSAGES.WISHLIST.NOT_FOUND);
  }
}
export class ForbiddenWishlistAccessException extends ForbiddenException {
  constructor() {
    super(ERROR_MESSAGES.WISHLIST.FORBIDDEN_DELETE);
  }
}
