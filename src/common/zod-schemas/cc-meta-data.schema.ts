import z from 'zod';
import { MetaDataSchema } from './meta-data.schema';
import { CCOpenGraphSchema } from './cc-open-graph-zod.schema';
import { CCReferenceSchema } from './cc-zod-schema';

export const CCPageMetaDataSchema = CCReferenceSchema.extend(
  MetaDataSchema.omit({ openGraph: true }).extend({
    openGraph: z.array(CCOpenGraphSchema).optional(),
  }).shape,
);

export type TCCPageMetaData = z.infer<typeof CCPageMetaDataSchema>;
