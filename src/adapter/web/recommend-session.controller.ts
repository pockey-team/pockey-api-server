import { Controller, Inject, Post, Delete, Param, Body } from '@nestjs/common';

import {
  RecommendSessionUseCase,
  SubmitAnswerRequest,
} from '../../application/port/in/recommend-session/RecommendSessionUseCase';

@Controller()
export class RecommendSessionController {
  constructor(
    @Inject('RecommendSessionUseCase')
    private readonly recommendSessionUseCase: RecommendSessionUseCase,
  ) {}

  @Post()
  async startSession() {
    return this.recommendSessionUseCase.startSession();
  }

  @Post(':sessionId/answer')
  async submitAnswer(@Param('sessionId') sessionId: string, @Body() command: SubmitAnswerRequest) {
    return this.recommendSessionUseCase.submitAnswer({ sessionId, answer: command.answer });
  }

  @Delete(':sessionId')
  async endSession(@Param('sessionId') sessionId: string) {
    return this.recommendSessionUseCase.endSession(sessionId);
  }
}
