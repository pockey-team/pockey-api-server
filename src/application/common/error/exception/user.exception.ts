import { NotFoundException } from '@nestjs/common';

import { ERROR_MESSAGES } from '../error-messages';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super(ERROR_MESSAGES.USER.NOT_FOUND);
  }
}
