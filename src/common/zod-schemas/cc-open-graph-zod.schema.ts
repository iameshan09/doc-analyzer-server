import z from 'zod';
import { CCReferenceSchema } from './cc-zod-schema';
import { ReducedOpenGraphSchema } from './open-graph-zod.schema';

export const CCOpenGraphSchema = CCReferenceSchema.extend(
  ReducedOpenGraphSchema.shape,
);

export type TCCOpenGraph = z.infer<typeof CCOpenGraphSchema>;
