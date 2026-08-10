'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { handleSignOut } from '@/app/actions/auth';

export default function NavLinks({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname();
  const [currentId, setCurrentId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/meetings/current')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((data) => setCurrentId(data.id))
      .catch(() => {});
  }, []);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/meetings', label: 'All Meetings' },
    { href: '/meetings/current', label: 'Current Program' },
  ];

  if (isLoggedIn) {
    links.push({ href: '/meetings/new', label: 'Create Program' });
  }

  return (
    <nav className="flex items-center gap-1 sm:gap-2">
      {links.map((link) => {
        let isActive = false;

        if (link.href === '/') {
          isActive = pathname === '/';
        } else if (link.href === '/meetings/current') {
          isActive =
            pathname === '/meetings/current' ||
            (currentId !== null && pathname === `/meetings/${currentId}`);
        } else if (link.href === '/meetings') {
          isActive =
            pathname === '/meetings' ||
            (pathname.startsWith('/meetings/') &&
              pathname !== '/meetings/current' &&
              pathname !== '/meetings/new' &&
              !pathname.endsWith('/edit') &&
              (currentId === null || pathname !== `/meetings/${currentId}`));
        } else if (link.href === '/meetings/new') {
          isActive = pathname === '/meetings/new' || pathname.endsWith('/edit');
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
              isActive
                ? 'text-brand-700 bg-brand-50 dark:text-brand-300 dark:bg-brand-950/50'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/50'
            }`}
          >
            {link.label}
            {isActive && (
              <span className="absolute inset-x-4 bottom-1 h-0.5 bg-brand-600 dark:bg-brand-400 rounded-full sm:hidden" />
            )}
          </Link>
        );
      })}

      {isLoggedIn ? (
        <form action={handleSignOut} className="ml-2">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-semibold rounded-full text-rose-600 bg-rose-50 hover:bg-rose-100 dark:text-rose-400 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 border border-rose-100 dark:border-rose-900/30 transition-all duration-200 cursor-pointer"
          >
            Sign Out
          </button>
        </form>
      ) : (
        <Link
          href="/login"
          className={`px-4 py-2 text-sm font-semibold rounded-full border border-brand-200 text-brand-600 bg-white hover:bg-brand-50 dark:border-brand-900/30 dark:text-brand-400 dark:bg-zinc-900 dark:hover:bg-brand-950/20 transition-all duration-200 ${
            pathname === '/login' ? 'bg-brand-50 dark:bg-brand-950/50 border-brand-600' : ''
          }`}
        >
          Leader Login
        </Link>
      )}
    </nav>
  );
}
