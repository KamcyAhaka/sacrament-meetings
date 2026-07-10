import NavLinks from './NavLinks';

export default function Header() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80 no-print">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Ward Info */}
        <div className="flex flex-col">
          <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Oak Hills 2nd Ward
          </span>
          <span 
            className="text-xs text-zinc-500 dark:text-zinc-400"
            suppressHydrationWarning
          >
            {currentDate}
          </span>
        </div>

        {/* Navigation */}
        <NavLinks />
      </div>
    </header>
  );
}
