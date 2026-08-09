import { z } from 'zod';
import { SacramentMeeting } from './types';

// ---------------------------------------------------------------------------
// Flat hymn number helper
// ---------------------------------------------------------------------------

const hymnNumber = (label: string) =>
  z.coerce
    .number({ error: `${label} number must be a number` })
    .int(`${label} number must be a whole number`)
    .positive(`${label} number must be a positive integer`);

// ---------------------------------------------------------------------------
// MeetingFormSchema
//
// All fields map 1-to-1 with named <input>/<select>/<textarea> elements.
// Nested model objects (Hymn, SpeakerItem, WardBusinessItem) are submitted
// as flat or parallel fields and reconstructed in the server action before
// writing to the database.
// ---------------------------------------------------------------------------

export const MeetingFormSchema = z.object({
  // ── Basic info ─────────────────────────────────────────────────────────
  /** ISO date string 'YYYY-MM-DD' */
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),

  meetingType: z.enum(['testimony', 'regular', 'stake', 'general'], {
    error: 'Please select a valid meeting type',
  }),

  presiding: z.string().min(1, 'Presiding leader is required'),
  conducting: z.string().min(1, 'Conducting leader is required'),

  // ── Opening ────────────────────────────────────────────────────────────
  /** <input type="number" name="openingHymnNumber"> */
  openingHymnNumber: hymnNumber('Opening hymn'),
  /** <input type="text"   name="openingHymnTitle">  */
  openingHymnTitle: z.string().min(1, 'Opening hymn title is required'),
  openingPrayer: z.string().min(1, 'Opening prayer name is required'),

  // ── Sacrament Hymn ─────────────────────────────────────────────────────
  sacramentHymnNumber: hymnNumber('Sacrament hymn'),
  sacramentHymnTitle: z.string().min(1, 'Sacrament hymn title is required'),

  // ── Speakers (parallel arrays from repeated <input name="speakerName"> etc.)
  /** formData.getAll('speakerName') */
  speakerNames: z.array(z.string()).optional().default([]),
  /** formData.getAll('speakerTopic') */
  speakerTopics: z.array(z.string()).optional().default([]),
  /** formData.getAll('speakerType') */
  speakerTypes: z
    .array(z.enum(['speaker', 'musical-number']))
    .optional()
    .default([]),

  // ── Closing ────────────────────────────────────────────────────────────
  closingHymnNumber: hymnNumber('Closing hymn'),
  closingHymnTitle: z.string().min(1, 'Closing hymn title is required'),
  closingPrayer: z.string().min(1, 'Closing prayer name is required'),

  // ── Ward Business (one description per line) ───────────────────────────
  wardBusiness: z
    .string()
    .optional()
    .transform((val) => {
      if (!val?.trim()) return [];
      return val
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((description) => ({ description }));
    }),

  // ── Stake Business (checkbox → 'true' | undefined) ─────────────────────
  stakeBusiness: z
    .string()
    .optional()
    .transform((val) => val === 'true'),

  // ── Announcements (one item per line) ──────────────────────────────────
  announcements: z
    .string()
    .optional()
    .transform((val) => {
      if (!val?.trim()) return [];
      return val
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
    }),
});

// ---------------------------------------------------------------------------
// Convenience type for the validated + transformed output used in actions
// ---------------------------------------------------------------------------

export type MeetingFormData = z.output<typeof MeetingFormSchema>;

// ---------------------------------------------------------------------------
// FormState — returned by create/update actions for use with useActionState
// ---------------------------------------------------------------------------

export type FormState = {
  /** Per-field validation error arrays keyed on schema input field names */
  errors?: Partial<Record<keyof z.input<typeof MeetingFormSchema>, string[]>>;
  /** Top-level error message (non-field-specific) */
  message?: string;
  /** Resulting SacramentMeeting on success */
  data?: SacramentMeeting;
};
