import Link from 'next/link';
import { SacramentMeeting } from '@/lib/types';

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  // Format meeting date nicely
  const formattedDate = new Date(meeting.date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Map meeting type to tailwind colors
  const typeColors: Record<string, string> = {
    testimony: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/50',
    regular: 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950/30 dark:text-brand-300 dark:border-brand-900/50',
    stake: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-900/50',
    general: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/50',
  };

  const badgeColor = typeColors[meeting.meetingType] || 'bg-zinc-50 text-zinc-700 border-zinc-200';

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover-lift hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 transition-all duration-200">
      <div>
        {/* Card Header (Date & Type) */}
        <div className="flex items-start justify-between gap-4">
          <time className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            {formattedDate}
          </time>
          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${badgeColor} capitalize`}>
            {meeting.meetingType}
          </span>
        </div>

        {/* Conductors / Leaders */}
        <div className="mt-4">
          <h3 className="text-lg font-bold text-zinc-900 group-hover:text-brand-600 dark:text-zinc-100 dark:group-hover:text-brand-400 transition-colors">
            Sacrament Meeting
          </h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-medium text-zinc-800 dark:text-zinc-300">Conducting:</span> {meeting.conducting}
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-medium text-zinc-800 dark:text-zinc-300">Presiding:</span> {meeting.presiding}
          </p>
        </div>

        {/* Speakers / Agenda Highlights */}
        <div className="mt-4 border-t border-zinc-100 pt-3 dark:border-zinc-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Agenda Highlights
          </span>
          {meeting.meetingType === 'testimony' ? (
            <p className="mt-1 text-sm italic text-zinc-500 dark:text-zinc-400">
              Fast and Testimony Meeting (Open Sharing)
            </p>
          ) : meeting.speakers.length > 0 ? (
            <ul className="mt-1 space-y-1">
              {meeting.speakers.map((speaker, index) => (
                <li key={index} className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{speaker.name}</span>
                  {speaker.type === 'speaker' && speaker.topic ? ` - ${speaker.topic}` : ' (Musical Number)'}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
              No speakers scheduled.
            </p>
          )}
        </div>
      </div>

      {/* Detail Link */}
      <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {meeting.announcements?.length || 0} Announcements
        </span>
        <Link
          href={`/meetings/${meeting.id}`}
          className="inline-flex items-center text-sm font-semibold text-brand-600 dark:text-brand-400 group-hover:underline"
        >
          View Program
          <svg className="ml-1 h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
