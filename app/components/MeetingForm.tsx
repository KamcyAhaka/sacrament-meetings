'use client';

import Link from 'next/link';
import { type FormState } from '@/lib/schemas';
import { SacramentMeeting } from '@/lib/types';
import { SubmitButton } from './FormControls';
import {
  MeetingOverviewFields,
  MeetingProgramFields,
  MeetingBusinessFields,
} from './MeetingFormSections';

interface MeetingFormProps {
  action: (formData: FormData) => void;
  state: FormState;
  initialData?: SacramentMeeting;
  submitLabel?: string;
  cancelHref?: string;
}

export default function MeetingForm({
  action,
  state,
  initialData,
  submitLabel = 'Save Meeting',
  cancelHref = '/meetings',
}: MeetingFormProps) {
  return (
    <form action={action} className="flex flex-col gap-6">
      {/* Feedback Messages */}
      {state.message && !state.data && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
        >
          {state.message}
        </div>
      )}

      {state.data && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
        >
          Meeting saved successfully!
        </div>
      )}

      {/* Form Sections */}
      <MeetingOverviewFields errors={state.errors} initialData={initialData} />
      <MeetingProgramFields errors={state.errors} initialData={initialData} />
      <MeetingBusinessFields errors={state.errors} initialData={initialData} />

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-zinc-800">
        <Link
          href={cancelHref}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-slate-300 dark:hover:bg-zinc-700 transition-colors"
        >
          Cancel
        </Link>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
