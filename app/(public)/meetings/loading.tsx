export default function MeetingsLoading() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      {/* Search Bar Skeleton */}
      <div className="h-10 w-full max-w-xl bg-slate-200 dark:bg-zinc-800 rounded-xl" />

      {/* Grid of Meeting Card Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between h-[230px] rounded-2xl border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="h-4 w-24 bg-slate-200 dark:bg-zinc-800 rounded" />
                <div className="h-6 w-16 bg-slate-200 dark:bg-zinc-800 rounded" />
              </div>
              <div className="mt-4 space-y-2.5">
                <div className="h-6 w-36 bg-slate-200 dark:bg-zinc-800 rounded" />
                <div className="h-4 w-48 bg-slate-200 dark:bg-zinc-800 rounded" />
                <div className="h-4 w-40 bg-slate-200 dark:bg-zinc-800 rounded" />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="h-3 w-28 bg-slate-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-20 bg-slate-200 dark:bg-zinc-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
