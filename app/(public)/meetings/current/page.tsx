import { redirect } from 'next/navigation';
import { getCurrentMeeting } from '@/lib/meetings-db';

export default async function CurrentMeetingPage() {
  const currentMeeting = await getCurrentMeeting();

  if (currentMeeting) {
    redirect(`/meetings/${currentMeeting.id}`);
  } else {
    redirect('/meetings');
  }
}
