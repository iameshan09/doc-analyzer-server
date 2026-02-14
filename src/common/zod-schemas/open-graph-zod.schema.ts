import { z } from 'zod';

export const DefaultTemplateStringSchema = z.object({
  default: z.string(),
  template: z.string(),
});

export const AbsoluteTemplateStringSchema = z.object({
  absolute: z.string(),
  template: z.string().nullable(),
});

export const AbsoluteStringSchema = z.object({
  absolute: z.string(),
});

export const TemplateStringSchema = z.union([
  DefaultTemplateStringSchema,
  AbsoluteTemplateStringSchema,
  AbsoluteStringSchema,
]);

export const OpenGraphImageDescriptorSchema = z.object({
  url: z.union([z.url('Invalid image URL'), z.instanceof(URL)]),
  secureUrl: z.union([z.url(), z.instanceof(URL)]).optional(),
  alt: z.string().optional(),
  type: z.string().optional(),
  width: z.union([z.string(), z.number().positive()]).optional(),
  height: z.union([z.string(), z.number().positive()]).optional(),
});

export const OpenGraphImageSchema = z.union([
  z.url(),
  z.instanceof(URL),
  OpenGraphImageDescriptorSchema,
]);

export const OpenGraphVideoDescriptorSchema = z.object({
  url: z.union([z.url('Invalid video URL'), z.instanceof(URL)]),
  secureUrl: z.union([z.url(), z.instanceof(URL)]).optional(),
  type: z.string().optional(),
  width: z.union([z.string(), z.number().positive()]).optional(),
  height: z.union([z.string(), z.number().positive()]).optional(),
});

export const OpenGraphVideoSchema = z.union([
  z.url(),
  z.instanceof(URL),
  OpenGraphVideoDescriptorSchema,
]);

export const OpenGraphAudioDescriptorSchema = z.object({
  url: z.union([z.url('Invalid audio URL'), z.instanceof(URL)]),
  secureUrl: z.union([z.url(), z.instanceof(URL)]).optional(),
  type: z.string().optional(),
});

export const OpenGraphAudioSchema = z.union([
  z.url(),
  z.instanceof(URL),
  OpenGraphAudioDescriptorSchema,
]);

export const LocaleSchema = z.string();

export const OpenGraphMetadataSchema = z.object({
  determiner: z.enum(['a', 'an', 'the', 'auto', '']).optional(),
  title: z.union([z.string(), TemplateStringSchema]).optional(),
  description: z.string().optional(),
  emails: z.union([z.string(), z.array(z.string())]).optional(),
  phoneNumbers: z.union([z.string(), z.array(z.string())]).optional(),
  faxNumbers: z.union([z.string(), z.array(z.string())]).optional(),
  siteName: z.string().optional(),
  locale: LocaleSchema.optional(),
  alternateLocale: z.union([LocaleSchema, z.array(LocaleSchema)]).optional(),
  images: z
    .union([OpenGraphImageSchema, z.array(OpenGraphImageSchema)])
    .optional(),
  audio: z
    .union([OpenGraphAudioSchema, z.array(OpenGraphAudioSchema)])
    .optional(),
  videos: z
    .union([OpenGraphVideoSchema, z.array(OpenGraphVideoSchema)])
    .optional(),
  url: z.union([z.url(), z.instanceof(URL)]).optional(),
  countryName: z.string().optional(),
  ttl: z.number().optional(),
});

export const OpenGraphSchema = OpenGraphMetadataSchema;

export const ReducedOpenGraphSchema = z.object({
  images: z.array(z.url().trim().nonempty()).optional(),
});

export type TReducedOpenGraph = z.infer<typeof ReducedOpenGraphSchema>;

// Type exports
export type DefaultTemplateString = z.infer<typeof DefaultTemplateStringSchema>;
export type AbsoluteTemplateString = z.infer<
  typeof AbsoluteTemplateStringSchema
>;
export type AbsoluteString = z.infer<typeof AbsoluteStringSchema>;
export type TemplateString = z.infer<typeof TemplateStringSchema>;
export type Locale = z.infer<typeof LocaleSchema>;
export type OpenGraphImageDescriptor = z.infer<
  typeof OpenGraphImageDescriptorSchema
>;
export type OpenGraphImage = z.infer<typeof OpenGraphImageSchema>;
export type OpenGraphVideoDescriptor = z.infer<
  typeof OpenGraphVideoDescriptorSchema
>;
export type OpenGraphVideo = z.infer<typeof OpenGraphVideoSchema>;
export type OpenGraphAudioDescriptor = z.infer<
  typeof OpenGraphAudioDescriptorSchema
>;
export type OpenGraphAudio = z.infer<typeof OpenGraphAudioSchema>;
export type OpenGraphMetadata = z.infer<typeof OpenGraphMetadataSchema>;
export type OpenGraph = z.infer<typeof OpenGraphSchema>;
