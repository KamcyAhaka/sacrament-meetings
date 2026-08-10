import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leader Login',
  description: 'Sign in to the Oak Hills 2nd Ward sacrament meeting planner leader portal.',
};

export default async function LoginPage() {
  const session = await auth();

  // If the user is already signed in, redirect them to the homepage
  if (session?.user) {
    redirect('/');
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Title block */}
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Oak Hills 2nd Ward
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
          Sacrament Meeting Planner &mdash; Leader Portal
        </p>
      </div>

      <LoginForm />
    </div>
  );
}
