import { IsInt, IsString, Min } from 'class-validator';

import { SwaggerDto } from '../../../../common/decorators/swagger-dto.decorator';
import {
  RecommendSessionResult,
  RecommendSessionStep,
  RecommendSessionStepResponse,
} from '../../../../domain/recommend-session';

@SwaggerDto()
export class StartSessionRequest {
  @IsString()
  deviceId: string;

  @IsString()
  receiverName: string;
}

export class StartSessionCommand extends StartSessionRequest {
  userId?: number;
}

@SwaggerDto()
export class SubmitAnswerRequest {
  @Min(1)
  @IsInt()
  step: number;

  @IsString()
  answer: string;
}

export class SubmitAnswerCommand extends SubmitAnswerRequest {
  sessionId: string;
}

export interface RecommendSessionUseCase {
  getRecommendSessionResults(sessionId: string): Promise<RecommendSessionResult[]>;
  getRecommendSessionResult(sessionId: string, order: number): Promise<RecommendSessionResult>;
  startSession(command: StartSessionCommand): Promise<RecommendSessionStep>;
  submitAnswer(command: SubmitAnswerCommand): Promise<RecommendSessionStepResponse>;
  endSession(sessionId: string): Promise<void>;
}
