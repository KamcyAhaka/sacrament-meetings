'use client';

import { useActionState, use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import MeetingForm from '@/app/components/MeetingForm';
import { updateMeeting } from '@/lib/actions';
import { FormState } from '@/lib/schemas';
import { SacramentMeeting } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditMeetingPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = parseInt(resolvedParams.id, 10);

  const [meeting, setMeeting] = useState<SacramentMeeting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isNaN(id)) {
      notFound();
    }

    fetch(`/api/meetings/${id}`)
      .then((res) => {
        if (!res.ok) {
          notFound();
        }
        return res.json();
      })
      .then((data) => {
        setMeeting(data);
        setLoading(false);
      })
      .catch(() => {
        notFound();
      });
  }, [id]);

  const updateMeetingWithId = updateMeeting.bind(null, id);
  const initialState: FormState = {};
  const [state, formAction] = useActionState(updateMeetingWithId, initialState);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-8 text-center text-slate-500">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/3 mx-auto"></div>
          <div className="h-10 bg-slate-200 dark:bg-zinc-800 rounded max-w-md mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col gap-6">
        <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 dark:border-zinc-800">
          <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
            Edit Meeting <span className="text-slate-400 dark:text-zinc-500">#{id}</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Update the details below to modify this sacrament meeting plan.
          </p>
        </div>

        <MeetingForm
          action={formAction}
          state={state}
          initialData={meeting || undefined}
          submitLabel="Save Changes"
          cancelHref={`/meetings/${id}`}
        />
      </div>
    </div>
  );
}
