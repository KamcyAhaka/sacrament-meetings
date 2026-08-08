import { NextResponse } from 'next/server';
import { getCurrentMeeting } from '@/lib/meetings-db';

export async function GET() {
  const currentMeeting = await getCurrentMeeting();

  if (!currentMeeting) {
    return NextResponse.json({ error: 'No active program' }, { status: 404 });
  }

  return NextResponse.json({ id: currentMeeting.id });
}
