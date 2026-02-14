import { z } from 'zod';

export const LandingPageContentDataSchema = z.object({
  name: z.string().trim().nonempty(),
  pageId: z.string().trim().nonempty(),
  status: z.string().trim().nonempty(),
  preview_image: z.url().optional(),
  subdomain: z.string().optional(),
});

export type TLandingPageContentData = z.infer<
  typeof LandingPageContentDataSchema
>;
