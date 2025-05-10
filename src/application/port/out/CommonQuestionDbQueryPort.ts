import { CommonQuestion } from '../../../domain/common-question';

export interface CommonQuestionDbQueryPort {
  getCommonQuestionByStep(step: number): Promise<CommonQuestion | null>;
}
