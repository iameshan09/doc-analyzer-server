import { nanoid } from 'nanoid';

const generateUniqueId = (size = 10): string => {
  return nanoid(size);
};

export { generateUniqueId };
