'use client';

import { SacramentMeeting } from '@/lib/types';

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  // Format meeting date nicely
  const formattedDate = new Date(meeting.date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <article className="mx-auto max-w-3xl bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800 print-container">
      {/* Print Action / Action Bar */}
      <div className="no-print flex items-center justify-between px-6 py-4 bg-zinc-50 border-b border-zinc-100 dark:bg-zinc-950 dark:border-zinc-800">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          Program Preview
        </span>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-brand-600 rounded-lg hover:bg-brand-700 active:bg-brand-800 transition-colors shadow-sm"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Program
        </button>
      </div>

      <div className="p-8 sm:p-12 print-page">
        {/* Sacrament Bulletin Title */}
        <div className="text-center pb-8 border-b border-zinc-100 dark:border-zinc-800">
          <p className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-semibold">
            Oak Hills Second Ward
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Sacrament Meeting
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {formattedDate}
          </p>
        </div>

        {/* Conductors / Officers */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-b border-zinc-100 pb-6 dark:border-zinc-800">
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Presiding Officer
            </span>
            <span className="text-zinc-800 font-medium dark:text-zinc-200">
              {meeting.presiding}
            </span>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Conducting
            </span>
            <span className="text-zinc-800 font-medium dark:text-zinc-200">
              {meeting.conducting}
            </span>
          </div>
        </div>

        {/* Announcements section (Only visible on web / hides on clean printed program if desired, but let's show it elegantly) */}
        {meeting.announcements && meeting.announcements.length > 0 && (
          <div className="mt-8 border-b border-zinc-100 pb-8 dark:border-zinc-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Announcements
            </h2>
            <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
              {meeting.announcements.map((announcement, idx) => (
                <li key={idx}>{announcement}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Ward Business Section */}
        {((meeting.wardBusiness && meeting.wardBusiness.length > 0) || meeting.stakeBusiness) && (
          <div className="mt-8 border-b border-zinc-100 pb-8 dark:border-zinc-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Ward & Stake Business
            </h2>
            {meeting.stakeBusiness && (
              <p className="mt-3 text-sm font-medium text-brand-700 dark:text-brand-300">
                &bull; Stake business will be presented.
              </p>
            )}
            {meeting.wardBusiness && meeting.wardBusiness.length > 0 ? (
              <ul className="mt-2 list-none space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                {meeting.wardBusiness.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2 text-brand-500">&bull;</span>
                    <span>{item.description}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}

        {/* The Program Agenda / Liturgy */}
        <div className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-6 text-center">
            Order of Service
          </h2>

          <div className="space-y-6">
            {/* Opening items */}
            <div className="flex justify-between items-end border-b border-dotted border-zinc-200 pb-1 dark:border-zinc-800">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Opening Hymn</span>
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 text-right">
                No. {meeting.openingHymn.number} &mdash; {meeting.openingHymn.title}
              </span>
            </div>

            <div className="flex justify-between items-end border-b border-dotted border-zinc-200 pb-1 dark:border-zinc-800">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Invocation</span>
              <span className="text-sm text-zinc-900 dark:text-zinc-200">{meeting.openingPrayer}</span>
            </div>

            {/* Business (displayed inline if active) */}
            <div className="flex justify-between items-end border-b border-dotted border-zinc-200 pb-1 dark:border-zinc-800">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Ward / Stake Business</span>
              <span className="text-sm text-zinc-500 italic">As Noted Above</span>
            </div>

            {/* Sacrament */}
            <div className="flex justify-between items-end border-b border-dotted border-zinc-200 pb-1 dark:border-zinc-800">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 font-bold text-brand-700 dark:text-brand-400">Sacrament Hymn</span>
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 text-right">
                No. {meeting.sacramentHymn.number} &mdash; {meeting.sacramentHymn.title}
              </span>
            </div>

            <div className="flex justify-center items-center py-2 border-b border-zinc-100 dark:border-zinc-800 text-xs tracking-wider uppercase text-zinc-400 dark:text-zinc-500 font-semibold">
              Administration of the Sacrament
            </div>

            {/* Speakers / Musical Numbers */}
            {meeting.meetingType === 'testimony' ? (
              <div className="py-4 text-center">
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Bearing of Testimonies
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Members of the congregation are invited to share brief testimonies of Jesus Christ.
                </p>
              </div>
            ) : meeting.speakers && meeting.speakers.length > 0 ? (
              <div className="space-y-6">
                {meeting.speakers.map((speaker, idx) => {
                  const isMusical = speaker.type === 'musical-number';
                  return (
                    <div key={idx} className="flex justify-between items-start border-b border-dotted border-zinc-200 pb-1 dark:border-zinc-800">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          {isMusical ? 'Special Music' : idx === 0 ? 'First Speaker' : idx === meeting.speakers.length - 1 ? 'Concluding Speaker' : 'Speaker'}
                        </span>
                        {speaker.topic && (
                          <span className="text-xs text-zinc-500 dark:text-zinc-400 italic">
                            Topic: {speaker.topic}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 text-right">
                        {speaker.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* Closing items */}
            <div className="flex justify-between items-end border-b border-dotted border-zinc-200 pb-1 dark:border-zinc-800">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Closing Hymn</span>
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 text-right">
                No. {meeting.closingHymn.number} &mdash; {meeting.closingHymn.title}
              </span>
            </div>

            <div className="flex justify-between items-end border-b border-dotted border-zinc-200 pb-1 dark:border-zinc-800">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Benediction</span>
              <span className="text-sm text-zinc-900 dark:text-zinc-200">{meeting.closingPrayer}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
