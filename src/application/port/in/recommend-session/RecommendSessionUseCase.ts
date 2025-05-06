import { IsString } from 'class-validator';

import { SwaggerDto } from '../../../../common/decorators/swagger-dto.decorator';
import { RecommendSessionResult, RecommendSessionStep } from '../../../../domain/recommend-session';

@SwaggerDto()
export class SubmitAnswerRequest {
  @IsString()
  answer: string;
}

export class SubmitAnswerCommand extends SubmitAnswerRequest {
  sessionId: string;
}

export interface RecommendSessionUseCase {
  startSession(): Promise<RecommendSessionStep>;
  submitAnswer(
    command: SubmitAnswerCommand,
  ): Promise<RecommendSessionStep | RecommendSessionResult>;
  endSession(sessionId: string): Promise<void>;
}
