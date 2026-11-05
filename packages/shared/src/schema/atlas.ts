import { z } from 'zod';

export const localizedStringSchema = z.union([
  z.string().min(1),
  z.object({ zh: z.string().min(1), en: z.string().min(1).optional() }),
]);

export const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式应为 YYYY-MM-DD')
  .refine((s) => {
    const [y, m, d] = s.split('-').map(Number);
    const t = Date.UTC(y!, m! - 1, d!);
    const check = new Date(t);
    return (
      check.getUTCFullYear() === y && check.getUTCMonth() === m! - 1 && check.getUTCDate() === d
    );
  }, '日期不存在');

export const hexColorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/, '颜色应为 #RRGGBB 或 #RRGGBBAA');

export const routeSegmentTypeSchema = z.enum([
  'advance',
  'retreat',
  'defense',
  'counterattack',
  'naval',
  'supply',
  'other',
]);

export const entitySchema = z
  .object({
    id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/, 'id 只能包含小写字母、数字、连字符'),
    name: localizedStringSchema,
    color: hexColorSchema,
    description: localizedStringSchema.optional(),
    order: z.number().optional(),
  })
  .passthrough();

export const manifestSchema = z
  .object({
    schemaVersion: z.string().regex(/^\d+\.\d+\.\d+$/, 'schemaVersion 应为 MAJOR.MINOR.PATCH'),
    id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
    title: localizedStringSchema,
    subtitle: localizedStringSchema.optional(),
    timeRange: z.object({ start: dateStringSchema, end: dateStringSchema }),
    cover: z.string().optional(),
    description: localizedStringSchema.optional(),
    defaultView: z.object({
      center: z.tuple([
        z.number().min(-180).max(180),
        z.number().min(-85).max(85),
      ]),
      zoom: z.number().min(0).max(22),
    }),
    routes: z.array(z.string()).min(1),
    events: z.array(z.string()).min(1),
    entities: z.array(entitySchema).min(1),
    tags: z.array(z.string()).optional(),
    license: z.string().optional(),
    updatedAt: dateStringSchema.optional(),
    extensions: z.record(z.unknown()).optional(),
  })
  .passthrough();

export const routeFeatureSchema = z
  .object({
    type: z.literal('Feature'),
    geometry: z.object({
      type: z.literal('LineString'),
      coordinates: z.array(z.tuple([z.number(), z.number()])).min(2),
    }),
    properties: z
      .object({
        entityId: z.string(),
        startDate: dateStringSchema,
        endDate: dateStringSchema,
        order: z.number(),
        segmentType: routeSegmentTypeSchema.optional(),
        name: localizedStringSchema.optional(),
        description: localizedStringSchema.optional(),
        extensions: z.record(z.unknown()).optional(),
      })
      .passthrough(),
  })
  .passthrough();

export const routeFileSchema = z
  .object({
    type: z.literal('FeatureCollection'),
    features: z.array(routeFeatureSchema),
  })
  .passthrough();

export const eventSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
    atlasId: z.string(),
    name: localizedStringSchema,
    aliases: z.array(localizedStringSchema).optional(),
    date: dateStringSchema,
    endDate: dateStringSchema.optional(),
    location: z.object({
      lng: z.number().min(-180).max(180),
      lat: z.number().min(-85).max(85),
      place: localizedStringSchema.optional(),
    }),
    entityIds: z.array(z.string()).min(1),
    category: z.string().min(1),
    summary: localizedStringSchema,
    description: localizedStringSchema.optional(),
    images: z
      .array(
        z
          .object({
            src: z.string(),
            caption: localizedStringSchema.optional(),
            credit: z.string().optional(),
            license: z.string().optional(),
            width: z.number().optional(),
            height: z.number().optional(),
          })
          .passthrough(),
      )
      .optional(),
    sources: z
      .array(
        z
          .object({
            title: z.string(),
            url: z.string().url().optional(),
            author: z.string().optional(),
            year: z.number().optional(),
            note: z.string().optional(),
          })
          .passthrough(),
      )
      .optional(),
    relatedIds: z.array(z.string()).optional(),
    importance: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
    extensions: z.record(z.unknown()).optional(),
  })
  .passthrough();

export const atlasSummarySchema = z
  .object({
    id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
    title: localizedStringSchema,
    subtitle: localizedStringSchema.optional(),
    cover: z.string().optional(),
    timeRange: z.object({ start: dateStringSchema, end: dateStringSchema }),
    tags: z.array(z.string()).optional(),
    path: z.string().min(1),
  })
  .passthrough();

export const atlasIndexSchema = z
  .object({
    schemaVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
    atlases: z.array(atlasSummarySchema).min(1),
  })
  .passthrough();
