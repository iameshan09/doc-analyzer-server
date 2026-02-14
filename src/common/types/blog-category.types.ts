import { ZodObject, ZodRawShape } from 'zod';

interface IBlogCategoryTemplate<T extends ZodRawShape = ZodRawShape> {
  id: string;
  name: string;
  schema: ZodObject<T>;
  buildPrompt: (name: string) => string;
}

export type { IBlogCategoryTemplate };
