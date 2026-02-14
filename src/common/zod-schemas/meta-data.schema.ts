import z from 'zod';
import { ReducedOpenGraphSchema } from './open-graph-zod.schema';

export const MetaDataSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  openGraph: ReducedOpenGraphSchema.optional(),
});

export type TMetaData = z.infer<typeof MetaDataSchema>;
