import z from 'zod';

export const UrlOrEmpty = z.union([z.url(), z.literal('')]);
