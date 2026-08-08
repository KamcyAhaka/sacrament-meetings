'use server';

import {
  createMeeting as dbCreateMeeting,
  updateMeeting as dbUpdateMeeting,
  deleteMeeting as dbDeleteMeeting,
} from './meetings-db';
import { SacramentMeeting } from './types';
import { revalidatePath } from 'next/cache';
import { MeetingFormSchema, type FormState } from './schemas';


// ---------------------------------------------------------------------------
// Helper: extract FormData fields into a plain object for safeParse
// ---------------------------------------------------------------------------

function extractFormFields(
  formData: FormData,
): Record<string, string | undefined> {
  return {
    date: formData.get('date')?.toString(),
    meetingType: formData.get('meetingType')?.toString(),
    presiding: formData.get('presiding')?.toString(),
    conducting: formData.get('conducting')?.toString(),
    announcements: formData.get('announcements')?.toString(),
    openingHymn: formData.get('openingHymn')?.toString(),
    openingPrayer: formData.get('openingPrayer')?.toString(),
    wardBusiness: formData.get('wardBusiness')?.toString(),
    stakeBusiness: formData.get('stakeBusiness')?.toString(),
    sacramentHymn: formData.get('sacramentHymn')?.toString(),
    speakers: formData.get('speakers')?.toString(),
    closingHymn: formData.get('closingHymn')?.toString(),
    closingPrayer: formData.get('closingPrayer')?.toString(),
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
    const result = await dbCreateMeeting(parsed.data as Omit<SacramentMeeting, 'id'>);
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
    const result = await dbUpdateMeeting(
      id,
      parsed.data as Partial<Omit<SacramentMeeting, 'id'>>,
    );
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
