'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-6 font-semibold text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-brand-600 dark:hover:bg-brand-500 transition-colors"
    >
      {pending ? 'Saving…' : label}
    </button>
  );
}

export function FieldError({ id, errors }: { id?: string; errors?: string[] }) {
  return (
    <div id={id} aria-live="polite" className="mt-1">
      {errors && errors.length > 0 && (
        <ul className="space-y-0.5">
          {errors.map((e) => (
            <li key={e} className="text-xs text-red-500 dark:text-red-400">
              {e}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  errors?: string[];
  mono?: boolean;
}

export function FormInput({ id, label, errors, mono, className = '', ...props }: FormInputProps) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </label>
      <input
        id={id}
        {...props}
        aria-describedby={errorId}
        className={`h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${mono ? 'font-mono' : ''} ${className}`}
      />
      <FieldError id={errorId} errors={errors} />
    </div>
  );
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  errors?: string[];
  mono?: boolean;
}

export function FormTextarea({ id, label, errors, mono, className = '', ...props }: FormTextareaProps) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </label>
      <textarea
        id={id}
        {...props}
        aria-describedby={errorId}
        className={`rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none ${mono ? 'font-mono' : ''} ${className}`}
      />
      <FieldError id={errorId} errors={errors} />
    </div>
  );
}
