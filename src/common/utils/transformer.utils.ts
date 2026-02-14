import { TransformFnParams } from 'class-transformer';

// Transform string to number, return undefined if invalid
const transformToNumber = ({ value }: TransformFnParams) => {
  const num = Number(value);
  return isNaN(num) ? undefined : num; // Return undefined for invalid numbers
};

// Trim whitespace from string values
const trimString = ({ value }: TransformFnParams) => {
  if (typeof value === 'string') {
    return value.trim();
  }

  // Cast to unknown for safety so we don't return an `any` directly.
  return value;
};

// Trim and convert string to lowercase
const trimAndLowerCase = ({ value }: TransformFnParams) => {
  if (typeof value === 'string') {
    return value.trim().toLowerCase();
  }
  return value; // Trim and lowercase if string
};

export { transformToNumber, trimAndLowerCase, trimString };
