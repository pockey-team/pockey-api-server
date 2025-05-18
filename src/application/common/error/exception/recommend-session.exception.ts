import { BadRequestException, NotFoundException } from '@nestjs/common';

import { ERROR_MESSAGES } from '../error-messages';

export class RecommendSessionNotFoundException extends NotFoundException {
  constructor() {
    super(ERROR_MESSAGES.RECOMMEND_SESSION.NOT_FOUND);
  }
}

export class RecommendSessionAlreadyEndedException extends BadRequestException {
  constructor() {
    super(ERROR_MESSAGES.RECOMMEND_SESSION.ALREADY_ENDED);
  }
}

export class RecommendSessionInvalidAnswerException extends BadRequestException {
  constructor() {
    super(ERROR_MESSAGES.RECOMMEND_SESSION.INVALID_ANSWER);
  }
}

export class RecommendProductNotFoundException extends NotFoundException {
  constructor() {
    super(ERROR_MESSAGES.RECOMMEND_SESSION.PRODUCT_NOT_FOUND);
  }
}

export class RecommendSessionInvalidStepException extends BadRequestException {
  constructor() {
    super(ERROR_MESSAGES.RECOMMEND_SESSION.INVALID_STEP);
  }
}
