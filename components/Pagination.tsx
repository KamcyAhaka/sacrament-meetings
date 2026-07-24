'use client';

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';

interface PaginationProps {
  totalPages: number;
}

export function Pagination({ totalPages }: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPage = Number(searchParams.get('page')) || 1;

  if (totalPages <= 1) {
    return null;
  }

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Generate page numbers array
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  return (
    <nav
      className="no-print flex items-center justify-between border-t border-slate-200 px-4 sm:px-0 py-6 dark:border-zinc-800"
      aria-label="Pagination Navigation"
    >
      <div className="-mt-px flex w-0 flex-1">
        {currentPage <= 1 ? (
          <span className="inline-flex items-center pr-1 pt-4 text-sm font-semibold text-slate-300 dark:text-zinc-600 select-none">
            <svg
              className="mr-3 h-5 w-5 text-slate-300 dark:text-zinc-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Previous
          </span>
        ) : (
          <Link
            href={createPageUrl(prevPage)}
            className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:border-zinc-700 transition-colors"
          >
            <svg
              className="mr-3 h-5 w-5 text-slate-400 dark:text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Previous
          </Link>
        )}
      </div>

      <div className="hidden md:-mt-px md:flex gap-1">
        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <Link
              key={p}
              href={createPageUrl(p)}
              aria-current={isActive ? 'page' : undefined}
              className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              {p}
            </Link>
          );
        })}
      </div>

      <div className="-mt-px flex w-0 flex-1 justify-end">
        {currentPage >= totalPages ? (
          <span className="inline-flex items-center pl-1 pt-4 text-sm font-semibold text-slate-300 dark:text-zinc-600 select-none">
            Next
            <svg
              className="ml-3 h-5 w-5 text-slate-300 dark:text-zinc-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        ) : (
          <Link
            href={createPageUrl(nextPage)}
            className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:border-zinc-700 transition-colors"
          >
            Next
            <svg
              className="ml-3 h-5 w-5 text-slate-400 dark:text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        )}
      </div>
    </nav>
  );
}
