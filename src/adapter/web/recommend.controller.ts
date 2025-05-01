import { Controller, Inject, Post, Get, Delete, Param, Query, Body } from '@nestjs/common';

import {
  RecommendUseCase,
  SubmitAnswerRequest,
} from '../../application/port/in/post/RecommendUseCase';

@Controller()
export class RecommendController {
  constructor(
    @Inject('RecommendUseCase')
    private readonly recommendUseCase: RecommendUseCase,
  ) {}

  @Post('session')
  async startRecommendSession() {
    return this.recommendUseCase.startSession();
  }

  @Post('session/:sessionId/answer')
  async submitAnswer(@Param('sessionId') sessionId: string, @Body() command: SubmitAnswerRequest) {
    return this.recommendUseCase.submitAnswer({ sessionId, answer: command.answer });
  }

  @Delete('session/:sessionId')
  async endRecommendSession(@Param('sessionId') sessionId: string) {
    return this.recommendUseCase.endSession(sessionId);
  }

  @Get('session/:sessionId/result')
  async getRecommendResult(@Param('sessionId') sessionId: string) {
    return this.recommendUseCase.getResult(sessionId);
  }

  @Get('session')
  async getRecommendSessions(@Query('userId') userId: string) {
    return this.recommendUseCase.getSessions(userId);
  }
}
