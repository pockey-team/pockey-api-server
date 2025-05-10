import { CommonQuestion } from '../../../domain/common-question';

export interface CommonQuestionDbQueryPort {
  getCommonQuestionsByStep(step: number): Promise<CommonQuestion[]>;
}
