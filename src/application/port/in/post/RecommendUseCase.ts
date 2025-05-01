import { IsString } from 'class-validator';

import { SwaggerDto } from '../../../../common/decorators/swagger-dto.decorator';
import { AnswerResponse, RecommendResult, SessionResponse } from '../../../../domain/recommend';

@SwaggerDto()
export class SubmitAnswerRequest {
  @IsString()
  answer: string;
}

export class SubmitAnswerCommand extends SubmitAnswerRequest {
  sessionId: string;
}

export interface RecommendUseCase {
  startSession(): Promise<SessionResponse>;
  submitAnswer(command: SubmitAnswerCommand): Promise<AnswerResponse>;
  endSession(sessionId: string): Promise<void>;
  getResult(sessionId: string): Promise<RecommendResult>;
  getSessions(userId: string): Promise<RecommendResult[]>;
}
