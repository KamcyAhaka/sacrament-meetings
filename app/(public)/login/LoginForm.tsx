'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/actions/auth';

export default function LoginForm() {
  const [errorMessage, dispatch, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-md p-8 shadow-lg hover-lift dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Sign In
        </h2>
        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
          Access secure admin features to schedule programs and manage bulletins.
        </p>
      </div>

      <form action={dispatch} className="flex flex-col gap-4">
        {/* Error Message banner */}
        {errorMessage && (
          <div 
            id="error-banner"
            className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-400"
          >
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label 
            htmlFor="email-input" 
            className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Email Address
          </label>
          <input
            id="email-input"
            name="email"
            type="email"
            placeholder="leader@example.com"
            required
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-600 transition-all duration-200"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label 
            htmlFor="password-input" 
            className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Password
          </label>
          <input
            id="password-input"
            name="password"
            type="password"
            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
            required
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-600 transition-all duration-200"
          />
        </div>

        <button
          id="submit-button"
          type="submit"
          disabled={isPending}
          className="mt-2 flex h-10 w-full items-center justify-center rounded-xl bg-brand-600 font-semibold text-white shadow-sm hover:bg-brand-500 active:bg-brand-700 disabled:bg-slate-300 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600 transition-all duration-200"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Signing In...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
    </div>
  );
}
