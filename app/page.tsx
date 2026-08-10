import Image from 'next/image';
import Link from 'next/link';
import { getCurrentMeeting } from '@/lib/meetings-db';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to the Oak Hills 2nd Ward Sacrament Meeting Planner. Plan agendas, search hymns, manage ward announcements, and print weekly bulletins.',
};

export default async function Home() {
  const currentMeeting = await getCurrentMeeting();
  
  // Format meeting date nicely if available
  const currentMeetingDate = currentMeeting
    ? new Date(currentMeeting.date + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="flex flex-col gap-12 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl">
        {/* Serene hero background image */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent z-10" />
        <Image
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop"
          alt="Serene nature landscape representing peace and reverence"
          width={1200}
          height={600}
          priority
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />

        <div className="relative z-20 flex flex-col items-start justify-center px-6 py-20 sm:px-12 md:py-28 max-w-xl gap-6">
          <span className="inline-flex items-center rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-300 backdrop-blur-md">
            Worship With Us
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Sacrament Meeting Planner
          </h1>
          <p className="text-base sm:text-lg text-slate-200">
            Welcome to the digital sacrament program planner for the Oak Hills 2nd Ward. Access weekly agendas, hymns, speakers, and announcements online or prepare copies for print.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/meetings"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-600 px-6 font-semibold text-white shadow-sm hover:bg-brand-500 active:bg-brand-700 transition-all duration-200"
            >
              Browse All Programs
            </Link>
            {currentMeeting && (
              <Link
                href="/meetings/current"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-white/10 px-6 font-semibold text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
              >
                Today&apos;s Program
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left/Middle Column - Active Program Teaser */}
        <section className="md:col-span-2 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                Upcoming Sacrament Service
              </h2>
              <span className="inline-flex items-center rounded-full bg-brand-50 dark:bg-brand-950/40 px-2.5 py-0.5 text-xs font-semibold text-brand-700 dark:text-brand-300">
                Next Program
              </span>
            </div>

            {currentMeeting ? (
              <div className="mt-6 space-y-4">
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {currentMeetingDate}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Presiding
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {currentMeeting.presiding}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Conducting
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {currentMeeting.conducting}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 dark:border-zinc-800">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Sacrament Hymn
                  </span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    No. {currentMeeting.sacramentHymn.number} &mdash; {currentMeeting.sacramentHymn.title}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                No upcoming sacrament program scheduled at this time.
              </p>
            )}
          </div>

          {currentMeeting && (
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-zinc-800">
              <Link
                href={`/meetings/${currentMeeting.id}`}
                className="inline-flex items-center font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                View Full Agenda
                <svg className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </section>

        {/* Right Column - Navigation Cards */}
        <section className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                All Archives
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Browse through the list of all historic and planned sacrament programs. Search by date, speaker names, topics, or hymns.
              </p>
            </div>
            <Link
              href="/meetings"
              className="mt-6 inline-flex items-center text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Go to Archives
              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                Need Help?
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                For scheduling speaker assignments, ward announcements, musical numbers, or submitting bulletin updates, please contact the ward executive secretary.
              </p>
            </div>
            <span className="mt-6 text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
              Oak Hills Ward Clerks Office
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
