import { Types } from 'mongoose';

// Trim whitespace and convert to lowercase
const trimAndLowercase = (str: string) => {
  return str.trim().toLowerCase();
};

// Replace spaces with underscores after trimming
const joinStringSpacesWithUnderscore = (str: string) => {
  return str.trim().replace(/\s+/g, '_'); // Replace one or more spaces with underscore
};

// Compare strings ignoring case differences
const isEqualIgnoringCase = (str1: string, str2: string) => {
  return str1.localeCompare(str2, undefined, { sensitivity: 'accent' }) === 0; // Case-insensitive comparison
};

// Convert string to MongoDB ObjectId
const toObjectId = (str: string | Types.ObjectId) => {
  return typeof str === 'string' ? new Types.ObjectId(str) : str; // Convert if string, otherwise return as-is
};

const isNotEmptyString = (str?: string) => {
  if (!str) return false;
  return str.trim().length > 0;
};

export {
  trimAndLowercase,
  joinStringSpacesWithUnderscore,
  isEqualIgnoringCase,
  toObjectId,
  isNotEmptyString,
};
