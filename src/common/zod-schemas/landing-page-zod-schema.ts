import z from 'zod';
import {
  cardVariants,
  componentTypes,
  galleryVariants,
  heroVariants,
  iconTypes,
  mapVariants,
  sectionVariants,
  sliderVariants,
  stackChildTypes,
} from '../constants/page-content.feature.constants';
import { UrlOrEmpty } from './common-zod.schemas';
import { MetaDataSchema } from './meta-data.schema';

export const TimeInfoSchemaV2 = z.object({
  day: z.number().int().min(0).max(7),
  time: z.string().regex(/^\d{4}$/),
});

export const PeriodSchemaV2 = z.object({
  open: TimeInfoSchemaV2,
  close: TimeInfoSchemaV2,
});

export const HoursSchema = z.object({
  periods: z.array(PeriodSchemaV2).optional(),
  weekday_text: z.array(z.string().nonempty()).optional(),
});

export type THours = z.infer<typeof HoursSchema>;

export const OpeningHoursSchemaV2 = z.object({
  openNow: z.coerce.boolean(),
  timezone: z.string().optional(),
  hours: HoursSchema.optional(),
  notes: z.string().optional(),
});

export type TOpeningHoursV2 = z.infer<typeof OpeningHoursSchemaV2>;

export const AuthorAttributionSchema = z.object({
  displayName: z.string().nonempty(),
  uri: UrlOrEmpty,
  photoUri: UrlOrEmpty.optional(),
});
export type TAuthorAttribution = z.infer<typeof AuthorAttributionSchema>;

export const HeroVariantSchema = z.enum(heroVariants);

export const HeroSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().optional(),
  bgImage: UrlOrEmpty.optional(),
  variant: HeroVariantSchema.optional(),
  rating: z.number().optional(),
  totalReviews: z.number().optional(),
});

export type THero = z.infer<typeof HeroSchema>;

export const MapVariantSchema = z.enum(mapVariants);

export const MapSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  variant: MapVariantSchema.optional(),
  address: z.string().trim().optional(),
});

export type TMap = z.infer<typeof MapSchema>;

export const IconTypeSchema = z.enum(iconTypes);

export const YesNoOption = z.object({
  key: z.string().trim().nonempty(),
  value: z.coerce.boolean(),
});

const YesNoInfoSchema = z.object({
  options: z.array(YesNoOption).min(1),
  iconType: IconTypeSchema,
  groupName: z.string().trim().nonempty(),
});

export type TYesNoInfo = z.infer<typeof YesNoInfoSchema>;

export const LinkSchema = z.object({
  iconType: IconTypeSchema,
  href: z.string().trim().nonempty(),
});

export type TLink = z.infer<typeof LinkSchema>;

export const ComponentTypeSchema = z.enum(componentTypes);

export const StackChildTypeSchema = z.enum(stackChildTypes);

export const StackChildrenSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('business-hours-display'),
    data: OpeningHoursSchemaV2,
  }),
  z.object({
    type: z.literal('yes-no-info'),
    data: YesNoInfoSchema,
  }),
  z.object({
    type: z.literal('link'),
    data: LinkSchema,
  }),
]);

export type TStackChild = z.infer<typeof StackChildrenSchema>;

const StackSchema = z.object({
  components: z.array(StackChildrenSchema).min(1),
});

export type TStack = z.infer<typeof StackSchema>;

export const GalleryVariantSchema = z.enum(galleryVariants);

export const GallerySchema = z.object({
  photos: z.array(z.string().nonempty()).min(1),
  variant: GalleryVariantSchema,
});

export type TGallery = z.infer<typeof GallerySchema>;

export const ChipListSchema = z.object({
  items: z.array(z.string().trim().nonempty()).min(1),
});

export type TChipList = z.infer<typeof ChipListSchema>;

export const CardVariantSchema = z.enum(cardVariants);

export const CardSchema = z.object({
  variant: CardVariantSchema,
  bgImage: UrlOrEmpty.optional(),
  title: z.string().optional(),
  rating: z.number().optional(),
  totalReviews: z.number().optional(),
  description: z.string().trim().optional(),
  publishTime: z.string().optional(),
  authorAttribution: AuthorAttributionSchema.optional(),
  category: z.string().optional(),
});

export const SliderVariantSchema = z.enum(sliderVariants);

const SliderSchema = z.object({
  variant: SliderVariantSchema,
  items: z.array(CardSchema).min(1),
});

export type TSlider = z.infer<typeof SliderSchema>;

export const AccordionItemSchema = z.object({
  key: z.string().trim().nonempty(),
  value: z.string().trim().nonempty(),
});

const AccordionListSchema = z.object({
  items: z.array(AccordionItemSchema).min(1),
});

export type TAccordionList = z.infer<typeof AccordionListSchema>;

export const MarkUpTextSchema = z.object({
  text: z.string().trim().nonempty(),
});

export type TMarkUpText = z.infer<typeof MarkUpTextSchema>;

export const PopoverCommonSchema = z.object({
  triggerType: z.enum(['link']),
  triggerLeadingText: z.string(),
  triggerLeadingTextInteractivePart: z.string(),
  triggerLeadingTextInteractiveTextPostion: z.number(),
});

export const StoryRefImageSchema = z.object({
  description: z.string().trim().nonempty(),
  imageUrl: z.url().trim().nonempty(),
});

export type TStoryRefImage = z.infer<typeof StoryRefImageSchema>;

export const StoryTemplateSchema = z.enum([
  'royal-chronicle',
  'sky-citadel',
  'serendib-chronicle',
]);

export type TStoryTemplate = z.infer<typeof StoryTemplateSchema>;

export const StoryStatusSchema = z.enum(['initiated', 'processing', 'active']);

export type TStoryStatus = z.infer<typeof StoryStatusSchema>;

export const StorySchema = z.object({
  placeName: z.string().trim().nonempty(),
  description: z.string().trim().nonempty(),
  referenceImages: z.array(StoryRefImageSchema).min(1),
  storyJson: z.json().optional(),
  template: StoryTemplateSchema.or(z.literal('')).optional(),
  status: StoryStatusSchema,
});

export type TStory = z.infer<typeof StorySchema>;

const ComponentSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('hero'),
    data: HeroSchema,
  }),
  z.object({
    type: z.literal('map'),
    data: MapSchema,
  }),
  z.object({
    type: z.literal('stack'),
    data: StackSchema,
  }),
  z.object({
    type: z.literal('gallery'),
    data: GallerySchema,
  }),
  z.object({
    type: z.literal('markup-text'),
    data: MarkUpTextSchema,
  }),
  z.object({
    type: z.literal('chip-list'),
    data: ChipListSchema,
  }),
  z.object({
    type: z.literal('slider'),
    data: SliderSchema,
  }),
  z.object({
    type: z.literal('accordian-list'),
    data: AccordionListSchema,
  }),
]);

export type TComponent = z.infer<typeof ComponentSchema>;

export const sectionVariantSchema = z.enum(sectionVariants);

export type TSectionVariant = z.infer<typeof sectionVariantSchema>;

export const SectionSchema = z.object({
  title: z.string().nonempty(),
  subTitle: z.string().optional(),
  variant: sectionVariantSchema,
  children: z.array(ComponentSchema).min(1),
  backgroundColor: z.string().trim().optional(),
});

export type TSection = z.infer<typeof SectionSchema>;

export const LandingPageSchema = z.object({
  identifier: z.string().trim().nonempty(),
  pageId: z.string().trim().nonempty(),
  name: z.string().trim().nonempty(),
  meta_data: MetaDataSchema,
  sections: z.array(SectionSchema).min(1),
  status: z.union([
    z.literal('initiated'),
    z.literal('active'),
    z.literal('inactive'),
  ]),
  preview_image: z.url().trim().nonempty().optional(),
  subdomain: z.string().optional(),
  story: StorySchema.optional(),
});

export type TLandingPage = z.infer<typeof LandingPageSchema>;
