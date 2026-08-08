import Link from 'next/link';

export default function MeetingNotFound() {
  return (
    <div className="max-w-md mx-auto py-16 text-center">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center font-bold text-xl">
          !
        </div>
        <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
          Meeting Not Found
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          The sacrament meeting bulletin you requested could not be found.
        </p>
        <Link
          href="/meetings"
          className="mt-2 inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-6 font-semibold text-white hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-500 transition-colors"
        >
          Return to Meetings
        </Link>
      </div>
    </div>
  );
}
