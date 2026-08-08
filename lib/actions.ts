'use server';

import {
  createMeeting as dbCreateMeeting,
  updateMeeting as dbUpdateMeeting,
  deleteMeeting as dbDeleteMeeting,
} from './meetings-db';
import { SacramentMeeting } from './types';
import { revalidatePath } from 'next/cache';

/**
 * Server Action to create a new sacrament meeting.
 * Wraps the database call and revalidates relevant cached pages.
 */
export async function createMeeting(meeting: Omit<SacramentMeeting, 'id'>): Promise<SacramentMeeting> {
  const result = await dbCreateMeeting(meeting);
  revalidatePath('/meetings');
  revalidatePath('/');
  return result;
}

/**
 * Server Action to update an existing sacrament meeting.
 * Wraps the database call and revalidates relevant cached pages.
 */
export async function updateMeeting(
  id: number,
  updates: Partial<Omit<SacramentMeeting, 'id'>>
): Promise<SacramentMeeting | undefined> {
  const result = await dbUpdateMeeting(id, updates);
  revalidatePath('/meetings');
  revalidatePath(`/meetings/${id}`);
  revalidatePath('/');
  return result;
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
