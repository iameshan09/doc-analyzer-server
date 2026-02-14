import z from 'zod';

export const storyCoverSchema = z.object({
  title: z.string().trim().nonempty(),
  imageUrl: z.url().trim().nonempty(),
});

export type TStoryCover = z.infer<typeof storyCoverSchema>;

export const storyPanelSchema = z.object({
  text: z.string().trim().nonempty(),
  imageUrl: z.url().trim().nonempty(),
});

export type TStoryPanel = z.infer<typeof storyPanelSchema>;

export const storyEndingSchema = z.object({
  imageUrl: z.url().trim().nonempty(),
  text: z.string().trim().optional(),
});

export type TStoryEnding = z.infer<typeof storyEndingSchema>;

export const storyJsonSchema = z.object({
  name: z.string().trim().nonempty(),
  plot: z.string().trim().nonempty(),
  cover: storyCoverSchema,
  panels: z.array(storyPanelSchema).min(1),
  endinng: storyEndingSchema,
});

export type TStoryJson = z.infer<typeof storyJsonSchema>;
