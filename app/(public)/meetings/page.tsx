import { getMeetings, getMeetingsTotalPages } from '@/lib/meetings-db';
import { MeetingSearch } from '@/components/MeetingSearch';
import { MeetingCard } from '@/components/MeetingCard';
import { Pagination } from '@/components/Pagination';

interface PageProps {
  searchParams?: Promise<{ query?: string; page?: string }>;
}

export default async function MeetingsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || '';
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  const [meetings, totalPages] = await Promise.all([
    getMeetings(query, currentPage),
    getMeetingsTotalPages(query),
  ]);

  return (
    <div className="flex flex-col gap-8">
      {/* Search Bar Section */}
      <div className="no-print">
        <MeetingSearch />
        {query && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Showing results for &ldquo;<span className="font-semibold">{query}</span>&rdquo;
          </p>
        )}
      </div>

      {/* Program Grid */}
      {meetings.length > 0 ? (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
          <Pagination totalPages={totalPages} />
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
        </div>
      )}
    </div>
  );
}
