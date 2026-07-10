import Link from 'next/link';
import { headers } from 'next/headers';
import MeetingCard from '@/app/components/MeetingCard';
import { SacramentMeeting } from '@/lib/types';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function MeetingsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';

  // Get host headers dynamically to construct absolute fetch URL
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const apiUrl = `${baseUrl}/api/meetings?q=${encodeURIComponent(query)}`;
  const res = await fetch(apiUrl, { cache: 'no-store' });
  const meetings: SacramentMeeting[] = res.ok ? await res.json() : [];

  return (
    <div className="flex flex-col gap-8">
      {/* Search Bar Section */}
      <div className="no-print">
        <form method="GET" action="/meetings" className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <div className="relative flex-1">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by speaker, topic, hymn, date, or leader..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
            />
            {query && (
              <Link
                href="/meetings"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-semibold"
              >
                Clear
              </Link>
            )}
          </div>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-500 transition-colors"
          >
            Search
          </button>
        </form>
        {query && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Showing results for &ldquo;<span className="font-semibold">{query}</span>&rdquo;
          </p>
        )}
      </div>

      {/* Program Grid */}
      {meetings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl dark:border-zinc-800">
          <svg
            className="mx-auto h-12 w-12 text-slate-400 dark:text-zinc-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">No programs found</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            We couldn&apos;t find any sacrament meetings matching your query.
          </p>
          <div className="mt-6">
            <Link
              href="/meetings"
              className="inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-500 transition-colors"
            >
              Clear Filter
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
