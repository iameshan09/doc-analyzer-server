import { z } from 'zod';

// Document Structure Elements
export const documentStructureElements = z.enum([
  'html',
  'head',
  'body',
  'header',
  'footer',
  'main',
  'nav',
  'section',
  'article',
  'aside',
  'div',
]);

// Text Content Elements
export const textContentElements = z.enum([
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'span',
  'br',
  'hr',
  'pre',
  'blockquote',
  'ol',
  'ul',
  'li',
  'dl',
  'dt',
  'dd',
  'figure',
  'figcaption',
]);

// Text Formatting Elements
export const textFormattingElements = z.enum([
  'strong',
  'em',
  'b',
  'i',
  'u',
  's',
  'mark',
  'small',
  'sub',
  'sup',
  'code',
  'kbd',
  'samp',
  'var',
  'abbr',
  'cite',
  'q',
  'time',
  'data',
  'del',
  'ins',
]);

// Links & Media Elements
export const linksMediaElements = z.enum([
  'a',
  'img',
  'video',
  'audio',
  'source',
  'track',
  'picture',
  'iframe',
  'embed',
  'object',
  'param',
  'map',
  'area',
  'svg',
  'canvas',
]);

// Form Elements
export const formElements = z.enum([
  'form',
  'input',
  'textarea',
  'button',
  'select',
  'option',
  'optgroup',
  'label',
  'fieldset',
  'legend',
  'datalist',
  'output',
  'progress',
  'meter',
]);

// Table Elements
export const tableElements = z.enum([
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
  'caption',
  'col',
  'colgroup',
]);

// Interactive Elements
export const interactiveElements = z.enum([
  'details',
  'summary',
  'dialog',
  'menu',
]);

// Metadata Elements
export const metadataElements = z.enum([
  'title',
  'meta',
  'link',
  'style',
  'script',
  'noscript',
  'base',
]);

// Semantic Elements
export const semanticElements = z.enum([
  'address',
  'bdi',
  'bdo',
  'ruby',
  'rt',
  'rp',
  'wbr',
  'template',
]);

// All valid HTML5 elements (excluding deprecated)
export const html5Element = z.union([
  documentStructureElements,
  textContentElements,
  textFormattingElements,
  linksMediaElements,
  formElements,
  tableElements,
  interactiveElements,
  metadataElements,
  semanticElements,
]);

// HTML Element with attributes
export const htmlElementSchema = z.object({
  tag: html5Element,
  attributes: z.record(z.string(), z.any()).optional(),
  children: z
    .union([z.string(), z.array(z.lazy(() => htmlElementSchema))])
    .optional(),
  className: z.string().optional(),
  id: z.string().optional(),
  style: z.record(z.string(), z.string()).optional(),
});

// Component schema with HTML5 elements
export const componentSchema = z
  .object({
    id: z.string(),
    type: z.string(),
    element: html5Element,
    html: z.string(),
    classes: z.array(z.string()).default([]),
    editable: z.array(z.string()).default([]),
    children: z.array(z.string()).optional(),
    attributes: z.record(z.string(), z.any()).optional(),
  })
  .passthrough(); // Allow additional properties

// Page schema
export const pageSchema = z
  .object({
    id: z.string(),
    path: z.string(),
    title: z.string(),
    description: z.string().optional(),
    components: z.array(z.string()),
    meta: z
      .object({
        title: z.string(),
        description: z.string().optional(),
        keywords: z.array(z.string()).optional(),
      })
      .optional(),
  })
  .passthrough(); // Allow additional properties

// Global styles schema
export const globalStylesSchema = z
  .object({
    colors: z
      .object({
        primary: z.string(),
        secondary: z.string(),
        accent: z.string(),
        background: z.string().optional(),
        foreground: z.string().optional(),
      })
      .passthrough(), // Allow additional color properties
    fonts: z
      .object({
        heading: z.string(),
        body: z.string(),
        mono: z.string().optional(),
      })
      .passthrough(), // Allow additional font properties
    spacing: z.record(z.string(), z.string()).optional(),
    borderRadius: z.record(z.string(), z.string()).optional(),
  })
  .passthrough(); // Allow additional style properties

// Website structure schema
export const websiteStructureSchema = z
  .object({
    id: z.string(),
    name: z.string().optional(),
    pages: z.array(pageSchema),
    components: z.record(z.string(), componentSchema),
    globalStyles: globalStylesSchema,
    assets: z
      .array(
        z.object({
          id: z.string(),
          url: z.string(),
          type: z.enum(['image', 'video', 'audio', 'font', 'other']),
          name: z.string(),
        }),
      )
      .optional(),
  })
  .passthrough(); // Allow additional properties

// Export types
export type HTML5Element = z.infer<typeof html5Element>;
export type HTMLElementNode = z.infer<typeof htmlElementSchema>;
export type Component = z.infer<typeof componentSchema>;
export type Page = z.infer<typeof pageSchema>;
export type GlobalStyles = z.infer<typeof globalStylesSchema>;
export type WebsiteStructure = z.infer<typeof websiteStructureSchema>;
