import { NextRequest, NextResponse } from 'next/server';
import { getMeetings, searchMeetings } from '@/lib/meetings-db';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const date = searchParams.get('date');
  const q = searchParams.get('q');

  if (q) {
    const meetings = await searchMeetings(q);
    if (date) {
      return NextResponse.json(meetings.filter(m => m.date === date));
    }
    return NextResponse.json(meetings);
  }

  const meetings = await getMeetings(date || undefined);
  return NextResponse.json(meetings);
}
