'use server';

import {
  createMeeting as dbCreateMeeting,
  updateMeeting as dbUpdateMeeting,
  deleteMeeting as dbDeleteMeeting,
} from './meetings-db';
import { SacramentMeeting } from './types';
import { revalidatePath } from 'next/cache';
import { MeetingFormSchema, type MeetingFormData, type FormState } from './schemas';

// ---------------------------------------------------------------------------
// Helper: extract FormData → plain object for safeParse
//
// Scalar fields use formData.get(); speaker arrays use formData.getAll()
// so that each repeated <input name="speakerName"> is collected in order.
// ---------------------------------------------------------------------------

function extractFormFields(formData: FormData) {
  return {
    date: formData.get('date')?.toString(),
    meetingType: formData.get('meetingType')?.toString(),
    presiding: formData.get('presiding')?.toString(),
    conducting: formData.get('conducting')?.toString(),
    // Hymns – flat pairs
    openingHymnNumber: formData.get('openingHymnNumber')?.toString(),
    openingHymnTitle: formData.get('openingHymnTitle')?.toString(),
    openingPrayer: formData.get('openingPrayer')?.toString(),
    sacramentHymnNumber: formData.get('sacramentHymnNumber')?.toString(),
    sacramentHymnTitle: formData.get('sacramentHymnTitle')?.toString(),
    closingHymnNumber: formData.get('closingHymnNumber')?.toString(),
    closingHymnTitle: formData.get('closingHymnTitle')?.toString(),
    closingPrayer: formData.get('closingPrayer')?.toString(),
    // Speakers – parallel arrays (one entry per row)
    speakerNames: formData.getAll('speakerName').map((v) => v.toString()),
    speakerTopics: formData.getAll('speakerTopic').map((v) => v.toString()),
    speakerTypes: formData.getAll('speakerType').map((v) => v.toString()),
    // Business / misc
    wardBusiness: formData.get('wardBusiness')?.toString(),
    stakeBusiness: formData.get('stakeBusiness')?.toString(),
    announcements: formData.get('announcements')?.toString(),
  };
}

// ---------------------------------------------------------------------------
// Helper: reconstruct SacramentMeeting from validated flat schema output
// ---------------------------------------------------------------------------

function buildMeetingData(data: MeetingFormData): Omit<SacramentMeeting, 'id'> {
  const {
    openingHymnNumber,
    openingHymnTitle,
    sacramentHymnNumber,
    sacramentHymnTitle,
    closingHymnNumber,
    closingHymnTitle,
    speakerNames,
    speakerTopics,
    speakerTypes,
    ...rest
  } = data;

  return {
    ...rest,
    openingHymn: { number: openingHymnNumber, title: openingHymnTitle },
    sacramentHymn: { number: sacramentHymnNumber, title: sacramentHymnTitle },
    closingHymn: { number: closingHymnNumber, title: closingHymnTitle },
    // Zip the three parallel arrays; skip rows where the name is empty
    speakers: (speakerNames ?? [])
      .map((name, i) => ({
        name: name.trim(),
        topic: (speakerTopics ?? [])[i]?.trim() ?? '',
        type: ((speakerTypes ?? [])[i] ?? 'speaker') as 'speaker' | 'musical-number',
      }))
      .filter((s) => s.name),
  };
}

// ---------------------------------------------------------------------------
// Server Actions
// ---------------------------------------------------------------------------

/**
 * Server Action to create a new sacrament meeting.
 *
 * Validates the raw FormData values against MeetingFormSchema before
 * writing to the database. Returns a FormState with either field-level
 * validation errors or the newly created meeting.
 */
export async function createMeeting(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = extractFormFields(formData);
  const parsed = MeetingFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors as FormState['errors'],
      message: 'Validation failed. Please fix the errors below.',
    };
  }

  try {
    const result = await dbCreateMeeting(buildMeetingData(parsed.data));
    revalidatePath('/meetings');
    revalidatePath('/');
    return { data: result };
  } catch (err) {
    console.error('[createMeeting] Database error:', err);
    return { message: 'Database error: failed to create meeting.' };
  }
}

/**
 * Server Action to update an existing sacrament meeting.
 *
 * Validates the raw FormData values against MeetingFormSchema before
 * writing to the database. Returns a FormState with either field-level
 * validation errors or the updated meeting.
 */
export async function updateMeeting(
  id: number,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = extractFormFields(formData);
  const parsed = MeetingFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors as FormState['errors'],
      message: 'Validation failed. Please fix the errors below.',
    };
  }

  try {
    const result = await dbUpdateMeeting(id, buildMeetingData(parsed.data));
    if (!result) {
      return { message: `Meeting with ID ${id} was not found.` };
    }
    revalidatePath('/meetings');
    revalidatePath(`/meetings/${id}`);
    revalidatePath('/');
    return { data: result };
  } catch (err) {
    console.error('[updateMeeting] Database error:', err);
    return { message: 'Database error: failed to update meeting.' };
  }
}

/**
 * Server Action to delete a sacrament meeting by ID.
 * Wraps the database call and revalidates relevant cached pages.
 */
export async function deleteMeeting(id: number): Promise<boolean> {
  const result = await dbDeleteMeeting(id);
  revalidatePath('/meetings');
  revalidatePath('/');
  return result;
}
