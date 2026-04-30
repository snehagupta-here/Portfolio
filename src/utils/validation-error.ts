import type { ValidationError } from 'class-validator';

const VALIDATION_CONSTRAINT_PRIORITY = [
  'isDefined',
  'isNotEmpty',
  'isNotEmptyObject',
  'isString',
  'isEmail',
  'isMongoId',
  'isDateString',
  'isUrl',
  'isArray',
  'minLength',
  'min',
  'length',
  'matches',
  'max',
  'maxLength',
] as const;

function pickValidationMessage(
  constraints?: ValidationError['constraints'],
): string | undefined {
  if (!constraints) {
    return undefined;
  }

  for (const constraint of VALIDATION_CONSTRAINT_PRIORITY) {
    const message = constraints[constraint];

    if (message) {
      return message;
    }
  }

  return Object.values(constraints)[0];
}

export function collectValidationMessages(errors: ValidationError[]): string[] {
  return errors.flatMap((error) => {
    const message = pickValidationMessage(error.constraints);

    if (message) {
      return [message];
    }

    if (error.children?.length) {
      return collectValidationMessages(error.children);
    }

    return [];
  });
}

export function isValidationErrorArray(
  value: unknown,
): value is ValidationError[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        ('constraints' in item || 'children' in item),
    )
  );
}
