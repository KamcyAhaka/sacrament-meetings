import Link from 'next/link';

export default function CreateMeetingPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col gap-6">
        <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 dark:border-zinc-800">
          <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
            Create Meeting &mdash; Coming in Week 04
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            An interactive form for planning and creating new sacrament meetings
            will be fully implemented and wired next week.
          </p>
        </div>

        {/* Form Skeleton */}
        <div className="space-y-6 opacity-40 select-none pointer-events-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Date
              </label>
              <div className="h-10 bg-slate-100 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Meeting Type
              </label>
              <div className="h-10 bg-slate-100 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Presiding Leader
              </label>
              <div className="h-10 bg-slate-100 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Conducting Leader
              </label>
              <div className="h-10 bg-slate-100 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sacrament Hymn
            </label>
            <div className="h-10 bg-slate-100 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700" />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Link
            href="/meetings"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-6 font-semibold text-white hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-500 transition-colors">
            Return to Bulletins
          </Link>
        </div>
      </div>
    </div>
  );
}
