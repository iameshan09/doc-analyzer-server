import { Transform } from 'class-transformer';
import {
  isNotEmpty,
  isString,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { REGEX_NO_WORD_SPACING } from 'src/common/constants/regexes';
import {
  trimAndLowerCase,
  trimString,
} from 'src/common/utils/transformer.utils';

/**
 * Validates non-empty strings with optional trimming and lowercase transformation
 */
function IsCustomString(
  validationOptions?: ValidationOptions & {
    lowercase?: boolean;
    noSpaceBetween?: boolean;
  },
) {
  return function (object: object, propertyName: string) {
    /** Apply string transformation based on options */
    Transform(validationOptions?.lowercase ? trimAndLowerCase : trimString)(
      object,
      propertyName,
    );

    registerDecorator({
      name: 'isCustomString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value) {
          /** Check for valid non-empty string */
          return (
            isString(value) &&
            isNotEmpty(value) &&
            (validationOptions?.noSpaceBetween
              ? REGEX_NO_WORD_SPACING.test(value)
              : true)
          );
        },
        defaultMessage(args) {
          let defaultMessage = 'must be a non-empty string';
          if (validationOptions?.noSpaceBetween) {
            defaultMessage +=
              ' or cannot contain spaces bewtween words or characters';
          }
          return `${args?.property} ${defaultMessage}`;
        },
      },
    });
  };
}

export default IsCustomString;
