import { IsString } from 'class-validator';

import { SwaggerDto } from '../../../../common/decorators/swagger-dto.decorator';
import { Session, SessionAnswer } from '../../../../domain/recommend-session';

@SwaggerDto()
export class SubmitAnswerRequest {
  @IsString()
  answer: string;
}

export class SubmitAnswerCommand extends SubmitAnswerRequest {
  sessionId: string;
}

export interface RecommendSessionUseCase {
  startSession(): Promise<Session>;
  submitAnswer(command: SubmitAnswerCommand): Promise<SessionAnswer>;
  endSession(sessionId: string): Promise<void>;
}
