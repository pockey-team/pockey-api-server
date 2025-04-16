import 'reflect-metadata';
import { ApiProperty } from '@nestjs/swagger';
import { getMetadataStorage } from 'class-validator';
import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata';

type PropertyMetadata = {
  isOptional: boolean;
  validator: ValidationMetadata;
};

const VALIDATION_TYPE_MAP = {
  isString: { type: String, example: 'string' },
  isEmail: { type: String, example: 'example@example.com' },
  isNumber: { type: Number, example: '0' },
  isInt: { type: Number, example: '0' },
  isFloat: { type: Number, example: '0.0' },
  isBoolean: { type: Boolean, example: 'true' },
  isDate: { type: Date, example: '2024-01-01' },
  isUrl: { type: String, example: 'https://example.com' },
  isUUID: { type: String, example: 'uuid' },
  isArray: { type: Array, example: '[]' },
  isEnum: { type: String, example: 'enum' },
  isObject: { type: Object, example: 'object' },
} as const;

type ValidationType = keyof typeof VALIDATION_TYPE_MAP;

export function SwaggerDto(): ClassDecorator {
  return function (target: Function) {
    const propertyMetadata = extractPropertyMetadata(target);

    for (const [propertyKey, data] of Object.entries(propertyMetadata)) {
      const existingApiProperty = Reflect.getMetadata(
        'swagger/apiModelProperties',
        target.prototype,
        propertyKey,
      );

      if (!existingApiProperty) {
        const decoratorOptions = createDecoratorOptions(data.validator, data.isOptional);
        ApiProperty(decoratorOptions)(target.prototype, propertyKey);
      }
    }
  };
}

function extractPropertyMetadata(target: Function) {
  const validationMetadata = getMetadataStorage().getTargetValidationMetadatas(
    target,
    target.name,
    true,
    false,
  );

  const propertyMetadataMap: Record<string, PropertyMetadata> = {};
  for (const metadata of validationMetadata) {
    const propertyName = metadata.propertyName;

    if (propertyName in propertyMetadataMap) {
      continue;
    }

    const isOptional = isPropertyOptional(validationMetadata, propertyName);
    propertyMetadataMap[propertyName] = { isOptional, validator: metadata };
  }

  return propertyMetadataMap;
}

function createDecoratorOptions(validator: ValidationMetadata, isOptional: boolean) {
  const validatorName = validator.name;
  const validationType = validatorName as ValidationType;

  const validationInfo = VALIDATION_TYPE_MAP[validationType] ?? {
    type: String,
    example: `unknown (${validatorName})`,
  };

  return {
    example: validationInfo.example,
    type: validationInfo.type,
    required: !isOptional,
  };
}

function isPropertyOptional(
  validationMetadata: ValidationMetadata[],
  propertyName: string,
): boolean {
  return validationMetadata.some(
    metadata =>
      metadata.propertyName === propertyName &&
      (metadata.type === 'conditionalValidation' || metadata.name === 'isOptional'),
  );
}
