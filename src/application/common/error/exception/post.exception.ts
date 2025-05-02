import { NotFoundException } from '@nestjs/common';

import { ERROR_MESSAGES } from '../error-messages';

export class PostNotFoundException extends NotFoundException {
  constructor() {
    super(ERROR_MESSAGES.POST.NOT_FOUND);
  }
}
