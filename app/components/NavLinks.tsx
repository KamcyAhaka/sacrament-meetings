'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NavLinks() {
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

  return (
    <nav className="flex items-center gap-1 sm:gap-2">
      {links.map((link) => {
        let isActive = false;

        if (link.href === '/') {
          isActive = pathname === '/';
        } else if (link.href === '/meetings/current') {
          // Highlight "Current Program" if visiting /meetings/current or the active meeting ID directly
          isActive =
            pathname === '/meetings/current' ||
            (currentId !== null && pathname === `/meetings/${currentId}`);
        } else if (link.href === '/meetings') {
          // Highlight "All Meetings" on the main list or past dynamic IDs (excluding the current ID page)
          isActive =
            pathname === '/meetings' ||
            (pathname.startsWith('/meetings/') &&
              pathname !== '/meetings/current' &&
              (currentId === null || pathname !== `/meetings/${currentId}`));
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
    </nav>
  );
}
