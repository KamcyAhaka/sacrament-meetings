'use client';

import { useActionState } from 'react';
import MeetingForm from '@/app/components/MeetingForm';
import { createMeeting } from '@/lib/actions';
import { FormState } from '@/lib/schemas';

export default function CreateMeetingPage() {
  const initialState: FormState = {};
  const [state, formAction] = useActionState(createMeeting, initialState);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col gap-6">
        <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 dark:border-zinc-800">
          <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
            Create Meeting
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Fill in the details below to plan a new sacrament meeting.
          </p>
        </div>

        <MeetingForm
          action={formAction}
          state={state}
          submitLabel="Create Meeting"
          cancelHref="/meetings"
        />
      </div>
    </div>
  );
}
