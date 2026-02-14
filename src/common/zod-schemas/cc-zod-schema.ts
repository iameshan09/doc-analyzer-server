import z from 'zod';

export const CCMetaDataSchema = z.object({
  entryId: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
  contentType: z.string(),
  published: z.boolean().optional(),
});

export const CCEntitySchema = z.object({
  metaData: CCMetaDataSchema,
});

export const CCReferenceSchema = z.object({
  ccEntry: CCEntitySchema,
  identifier: z.string(),
});

export type TCCReference = z.infer<typeof CCReferenceSchema>;
