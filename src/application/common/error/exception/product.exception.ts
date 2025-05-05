import { NotFoundException } from '@nestjs/common';

import { ERROR_MESSAGES } from '../error-messages';

export class ProductNotFoundException extends NotFoundException {
  constructor() {
    super(ERROR_MESSAGES.PRODUCT.NOT_FOUND);
  }
}
