import { CommonQuestionDbEntity } from './common-question.entity';
import { CommonQuestion } from '../../domain/common-question';

export const mapToCommonQuestion = (dbEntity: CommonQuestionDbEntity): CommonQuestion => {
  return {
    step: dbEntity.step,
    question: dbEntity.question,
    options: dbEntity.options,
    optionImages: dbEntity.optionImages,
  };
};
