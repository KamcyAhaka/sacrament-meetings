import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import MeetingDetail from '@/app/components/MeetingDetail';
import { SacramentMeeting } from '@/lib/types';
import { getMeetingById } from '@/lib/meetings-db';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  
  if (isNaN(id)) {
    return { title: 'Program' };
  }

  try {
    const meeting = await getMeetingById(id);
    if (!meeting) {
      return { title: 'Program Not Found' };
    }

    const formattedDate = new Date(meeting.date + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    return {
      title: `${formattedDate} Program`,
      description: `Sacrament Meeting Program for the Oak Hills 2nd Ward on ${formattedDate}. Conducting: ${meeting.conducting}, Presiding: ${meeting.presiding}.`,
    };
  } catch (error) {
    return { title: 'Program Details' };
  }
}

export default async function MeetingDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    notFound();
  }

  // Get host headers dynamically to construct absolute fetch URL
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const apiUrl = `${baseUrl}/api/meetings/${id}`;
  const res = await fetch(apiUrl, { cache: 'no-store' });

  if (!res.ok) {
    notFound();
  }

  const meeting: SacramentMeeting = await res.json();

  return (
    <div className="py-4">
      <MeetingDetail meeting={meeting} />
    </div>
  );
}
