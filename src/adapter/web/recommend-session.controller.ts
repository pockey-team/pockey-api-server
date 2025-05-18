import { Controller, Inject, Post, Delete, Param, Body } from '@nestjs/common';

import {
  RecommendSessionUseCase,
  StartSessionRequest,
  SubmitAnswerRequest,
} from '../../application/port/in/recommend-session/RecommendSessionUseCase';

@Controller()
export class RecommendSessionController {
  constructor(
    @Inject('RecommendSessionUseCase')
    private readonly recommendSessionUseCase: RecommendSessionUseCase,
  ) {}

  @Post()
  async startSession(@Body() command: StartSessionRequest) {
    return this.recommendSessionUseCase.startSession(command);
  }

  @Post(':sessionId/answer')
  async submitAnswer(@Param('sessionId') sessionId: string, @Body() command: SubmitAnswerRequest) {
    return this.recommendSessionUseCase.submitAnswer({
      sessionId,
      answer: command.answer,
      step: command.step,
    });
  }

  @Delete(':sessionId')
  async endSession(@Param('sessionId') sessionId: string) {
    return this.recommendSessionUseCase.endSession(sessionId);
  }
}
