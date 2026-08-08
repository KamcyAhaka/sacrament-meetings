export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 no-print mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <div>
          &copy; {currentYear} Oak Hills 2nd Ward. All rights reserved.
        </div>
        <div className="flex gap-4">
          <span>Sacrament Meeting Planner</span>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <a
            href="https://www.churchofjesuschrist.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            ChurchofJesusChrist.org
          </a>
        </div>
      </div>
    </footer>
  );
}
