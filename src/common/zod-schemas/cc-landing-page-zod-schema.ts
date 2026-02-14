import z from 'zod';
import {
  AccordionItemSchema,
  AuthorAttributionSchema,
  CardSchema,
  ChipListSchema,
  GallerySchema,
  HeroSchema,
  IconTypeSchema,
  LandingPageSchema,
  LinkSchema,
  MapSchema,
  MarkUpTextSchema,
  SectionSchema,
  SliderVariantSchema,
  StoryRefImageSchema,
  StorySchema,
  TimeInfoSchemaV2,
  YesNoOption,
} from './landing-page-zod-schema';
import { CCReferenceSchema } from './cc-zod-schema';
import { CCPageMetaDataSchema } from './cc-meta-data.schema';

export const CCTimeInfoSchema = CCReferenceSchema.extend(
  TimeInfoSchemaV2.shape,
);

export type TCCTimeInfo = z.infer<typeof CCTimeInfoSchema>;

export const CCYesNoOptionSchema = CCReferenceSchema.extend(YesNoOption.shape);

export type TCCYesNoOption = z.infer<typeof CCYesNoOptionSchema>;

export const CCAuthorAttributionSchema = CCReferenceSchema.extend(
  AuthorAttributionSchema.shape,
);

export type TCCAuthorAttribution = z.infer<typeof CCAuthorAttributionSchema>;

export const CCAccordionItemSchema = CCReferenceSchema.extend(
  AccordionItemSchema.shape,
);

export type TCCAccordionItem = z.infer<typeof CCAccordionItemSchema>;

export const CCMarkUpTextSchema = CCReferenceSchema.extend(
  MarkUpTextSchema.shape,
);

export type TCCMarkUpText = z.infer<typeof CCMarkUpTextSchema>;

export const CCChipListSchema = CCReferenceSchema.extend(ChipListSchema.shape);

export type TCCChipList = z.infer<typeof CCChipListSchema>;

export const CCPeriodSchema = z.object({
  open: z.array(CCTimeInfoSchema).min(1).max(1),
  close: z.array(CCTimeInfoSchema).min(1).max(1),
});

export type TCCPeriod = z.infer<typeof CCPeriodSchema>;

export const CCLinkSchema = CCReferenceSchema.extend(LinkSchema.shape);

export type TCCLink = z.infer<typeof CCLinkSchema>;

export const CCYesNoInfoSchema = CCReferenceSchema.extend(
  z.object({
    options: z.array(CCYesNoOptionSchema).min(1),
    iconType: IconTypeSchema,
    groupName: z.string().trim().nonempty(),
  }).shape,
);

export type TCCYesNoInfo = z.infer<typeof CCYesNoInfoSchema>;

export const CCMapSchema = CCReferenceSchema.extend(MapSchema.shape);

export type TCCMap = z.infer<typeof CCMapSchema>;

export const CCHeroSchema = CCReferenceSchema.extend(HeroSchema.shape);

export type TCCHero = z.infer<typeof CCHeroSchema>;

export const CCGallerySchema = CCReferenceSchema.extend(GallerySchema.shape);

export type TCCGallery = z.infer<typeof CCGallerySchema>;

export const CCHoursSchema = CCReferenceSchema.extend(
  z.object({
    periods: z.array(CCPeriodSchema).optional(),
    weekday_text: z.array(z.string().nonempty()).optional(),
  }).shape,
);

export type TCCHours = z.infer<typeof CCHoursSchema>;

export const CCOpeiningHoursSchema = CCReferenceSchema.extend(
  z.object({
    openNow: z.coerce.boolean(),
    timezone: z.string().optional(), // Added timezone field
    hours: z.array(CCHoursSchema).min(1).max(1).optional(),
    notes: z.string().optional(), // Added notes field
  }).shape,
);

export type TCCOpeiningHours = z.infer<typeof CCOpeiningHoursSchema>;

export const CCAccordionListSchema = CCReferenceSchema.extend(
  z.object({
    items: z.array(CCAccordionItemSchema).min(1),
  }).shape,
);

export type TCCAccordionList = z.infer<typeof CCAccordionListSchema>;

export const CCCardSchema = CCReferenceSchema.extend(
  CardSchema.omit({ authorAttribution: true }).extend({
    authorAttribution: z
      .array(CCAuthorAttributionSchema)
      .min(1)
      .max(1)
      .optional(),
  }).shape,
);

export type TCCCard = z.infer<typeof CCCardSchema>;

export const CCCStackChildrenSchema = z.discriminatedUnion('type', [
  CCReferenceSchema.extend(
    z.object({
      type: z.literal('business-hours-display'),
      data: z.array(CCOpeiningHoursSchema).min(1).max(1),
    }).shape,
  ),

  CCReferenceSchema.extend(
    z.object({
      type: z.literal('yes-no-info'),
      data: z.array(CCYesNoInfoSchema).min(1).max(1),
    }).shape,
  ),

  CCReferenceSchema.extend(
    z.object({
      type: z.literal('link'),
      data: z.array(CCLinkSchema).min(1).max(1),
    }).shape,
  ),
]);

export type TCCStackChildren = z.infer<typeof CCCStackChildrenSchema>;

export const CCStackSchema = CCReferenceSchema.extend(
  z.object({
    components: z.array(CCCStackChildrenSchema).min(1),
  }).shape,
);

export type TCCStack = z.infer<typeof CCStackSchema>;

export const CCSliderSchema = CCReferenceSchema.extend(
  z.object({
    variant: SliderVariantSchema,
    items: z.array(CCCardSchema).min(1),
  }).shape,
);

export type TCCSlider = z.infer<typeof CCSliderSchema>;

export const CCStoryRefImageSchema = CCReferenceSchema.extend(
  StoryRefImageSchema.shape,
);

export const CCStorySchema = CCReferenceSchema.extend(
  StorySchema.omit({ referenceImages: true }).extend({
    referenceImages: z.array(CCStoryRefImageSchema).min(1),
  }).shape,
);

export type TCCStory = z.infer<typeof CCStorySchema>;

const CCComponentSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('hero'),
    data: z.array(CCHeroSchema).min(1).max(1),
  }),
  z.object({
    type: z.literal('map'),
    data: z.array(CCMapSchema).min(1).max(1),
  }),
  z.object({
    type: z.literal('stack'),
    data: z.array(CCStackSchema).min(1).max(1),
  }),
  z.object({
    type: z.literal('gallery'),
    data: z.array(CCGallerySchema).min(1).max(1),
  }),
  z.object({
    type: z.literal('markup-text'),
    data: z.array(CCMarkUpTextSchema).min(1).max(1),
  }),
  z.object({
    type: z.literal('chip-list'),
    data: z.array(CCChipListSchema).min(1).max(1),
  }),
  z.object({
    type: z.literal('slider'),
    data: z.array(CCSliderSchema).min(1).max(1),
  }),
  z.object({
    type: z.literal('accordian-list'),
    data: z.array(CCAccordionListSchema).min(1).max(1),
  }),
]);

export type TCCComponent = z.infer<typeof CCComponentSchema>;

export const CCSectionSchema = CCReferenceSchema.extend(
  SectionSchema.omit({ children: true }).extend({
    children: z.array(CCComponentSchema).min(1),
  }).shape,
);

export type TCCSection = z.infer<typeof CCComponentSchema>;

export const CCLandingPageSchema = CCReferenceSchema.extend(
  LandingPageSchema.omit({
    meta_data: true,
    sections: true,
    story: true,
  }).extend({
    meta_data: z.array(CCPageMetaDataSchema).min(1).max(1),
    sections: z.array(CCSectionSchema).min(1),
    story: z.array(CCStorySchema).min(1).max(1).optional(),
  }).shape,
);

export type TCCLandingPage = z.infer<typeof CCLandingPageSchema>;
