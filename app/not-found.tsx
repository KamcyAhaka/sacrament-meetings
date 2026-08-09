import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 py-16 text-center">
      {/* Decorative background glow */}
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
          <div
            className="aspect-[1155/678] w-[20rem] mx-auto bg-gradient-to-tr from-brand-300 to-brand-500 opacity-20 dark:from-brand-600 dark:to-brand-800 dark:opacity-30"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        {/* 404 Text Graphic */}
        <h1 className="font-serif text-9xl font-black tracking-tight text-slate-200 dark:text-zinc-800 select-none">
          404
        </h1>
      </div>

      {/* Message Content */}
      <h2 className="mt-6 font-serif text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        Page not found
      </h2>
      <p className="mt-4 max-w-md text-base leading-7 text-slate-500 dark:text-slate-400">
        The page you are looking for doesn't exist, or has been moved to a new address.
      </p>

      {/* Action Buttons */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/meetings"
          className="hover-lift inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-500 transition-colors shadow-md"
        >
          View Meetings
        </Link>
        <Link
          href="/"
          className="hover-lift inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
