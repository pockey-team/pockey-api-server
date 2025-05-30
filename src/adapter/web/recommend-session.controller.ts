import { Body, Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common';

import {
  RecommendSessionUseCase,
  StartSessionRequest,
  SubmitAnswerRequest,
} from '../../application/port/in/recommend-session/RecommendSessionUseCase';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../../domain/user';

@Controller()
export class RecommendSessionController {
  constructor(
    @Inject('RecommendSessionUseCase')
    private readonly recommendSessionUseCase: RecommendSessionUseCase,
  ) {}

  @Get(':sessionId/result')
  async getRecommendSessionResults(@Param('sessionId') sessionId: string) {
    return this.recommendSessionUseCase.getRecommendSessionResults(sessionId);
  }

  @Get(':sessionId/result/:order')
  async getRecommendSessionResultOne(
    @Param('sessionId') sessionId: string,
    @Param('order') order: number,
  ) {
    return this.recommendSessionUseCase.getRecommendSessionResult(sessionId, order);
  }

  @Post()
  async startSession(@Body() command: StartSessionRequest, @GetUser() user: User) {
    return this.recommendSessionUseCase.startSession({
      ...command,
      userId: user?.id,
    });
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
