import { z } from 'zod';
import { SacramentMeeting } from './types';

// ---------------------------------------------------------------------------
// Zod sub-schemas
// ---------------------------------------------------------------------------

const HymnSchema = z.object({
  number: z.coerce.number().int().positive('Hymn number must be a positive integer'),
  title: z.string().min(1, 'Hymn title is required'),
});

const SpeakerItemSchema = z.object({
  name: z.string().min(1, 'Speaker name is required'),
  topic: z.string().min(1, 'Topic is required'),
  type: z.enum(['speaker', 'musical-number']),
});

const WardBusinessItemSchema = z.object({
  description: z.string().min(1, 'Ward business description is required'),
});

// ---------------------------------------------------------------------------
// MeetingFormSchema
//
// All fields mirror SacramentMeeting but are expressed in terms of what
// arrives from raw FormData values (strings / JSON strings for nested
// objects). Coercions convert strings to the correct primitive types.
// ---------------------------------------------------------------------------

export const MeetingFormSchema = z.object({
  /** ISO date string: 'YYYY-MM-DD' */
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),

  meetingType: z.enum(['testimony', 'regular', 'stake', 'general'], {
    error: 'Meeting type must be testimony, regular, stake, or general',
  }),

  presiding: z.string().min(1, 'Presiding leader is required'),

  conducting: z.string().min(1, 'Conducting leader is required'),

  /**
   * Optional comma-separated announcements or a JSON array string.
   * Coerced to string[] when present.
   */
  announcements: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === '') return [];
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed as string[];
      } catch {
        // treat as comma-separated
      }
      return val.split(',').map((s) => s.trim()).filter(Boolean);
    }),

  /** JSON string representation of a Hymn object */
  openingHymn: z
    .string()
    .min(1, 'Opening hymn is required')
    .transform((val, ctx) => {
      try {
        return HymnSchema.parse(JSON.parse(val));
      } catch {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Opening hymn must be valid JSON {number, title}' });
        return z.NEVER;
      }
    }),

  openingPrayer: z.string().min(1, 'Opening prayer name is required'),

  /** JSON string representation of WardBusinessItem[] */
  wardBusiness: z
    .string()
    .optional()
    .transform((val, ctx) => {
      if (!val || val.trim() === '') return [];
      try {
        return z.array(WardBusinessItemSchema).parse(JSON.parse(val));
      } catch {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Ward business must be valid JSON array' });
        return z.NEVER;
      }
    }),

  /** 'true' | 'false' string coerced to boolean */
  stakeBusiness: z
    .string()
    .optional()
    .transform((val) => val === 'true'),

  /** JSON string representation of a Hymn object */
  sacramentHymn: z
    .string()
    .min(1, 'Sacrament hymn is required')
    .transform((val, ctx) => {
      try {
        return HymnSchema.parse(JSON.parse(val));
      } catch {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Sacrament hymn must be valid JSON {number, title}' });
        return z.NEVER;
      }
    }),

  /** JSON string representation of SpeakerItem[] */
  speakers: z
    .string()
    .optional()
    .transform((val, ctx) => {
      if (!val || val.trim() === '') return [];
      try {
        return z.array(SpeakerItemSchema).parse(JSON.parse(val));
      } catch {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Speakers must be valid JSON array' });
        return z.NEVER;
      }
    }),

  /** JSON string representation of a Hymn object */
  closingHymn: z
    .string()
    .min(1, 'Closing hymn is required')
    .transform((val, ctx) => {
      try {
        return HymnSchema.parse(JSON.parse(val));
      } catch {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Closing hymn must be valid JSON {number, title}' });
        return z.NEVER;
      }
    }),

  closingPrayer: z.string().min(1, 'Closing prayer name is required'),
});

// ---------------------------------------------------------------------------
// FormState — returned by create/update actions for use with useActionState
// ---------------------------------------------------------------------------

export type FormState = {
  /** Flat map of field-name → error messages for that field */
  errors?: Partial<Record<keyof z.input<typeof MeetingFormSchema>, string[]>>;
  /** Top-level error message (non-field-specific) */
  message?: string;
  /** Newly created / updated meeting on success */
  data?: SacramentMeeting;
};
