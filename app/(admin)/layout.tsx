import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Admin navigation header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6 dark:border-zinc-800">
        <div>
          <h1 className="font-serif text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Leader Portal
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage sacrament meeting plans, schedules, and bulletins.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center">
          <Link
            href="/meetings"
            className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 dark:text-slate-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 transition-colors">
            Back to Programs
          </Link>
          <Link
            href="/meetings/new"
            className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-brand-600 rounded-lg hover:bg-brand-500 dark:bg-brand-600 dark:hover:bg-brand-500 transition-colors">
            Create New Plan
          </Link>
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
}
