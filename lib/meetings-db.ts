import { SacramentMeeting } from './types';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface DatabaseMeetingRow {
  id: number;
  date: Date | string;
  meeting_type: SacramentMeeting['meetingType'];
  presiding: string;
  conducting: string;
  announcements: string[] | null;
  opening_hymn: SacramentMeeting['openingHymn'];
  opening_prayer: string;
  ward_business: SacramentMeeting['wardBusiness'] | null;
  stake_business: boolean | null;
  sacrament_hymn: SacramentMeeting['sacramentHymn'];
  speakers: SacramentMeeting['speakers'] | null;
  closing_hymn: SacramentMeeting['closingHymn'];
  closing_prayer: string;
}

function mapRowToMeeting(row: DatabaseMeetingRow): SacramentMeeting {
  return {
    id: row.id,
    date: row.date instanceof Date ? formatDate(row.date) : String(row.date).split('T')[0],
    meetingType: row.meeting_type,
    presiding: row.presiding,
    conducting: row.conducting,
    announcements: row.announcements || [],
    openingHymn: row.opening_hymn,
    openingPrayer: row.opening_prayer,
    wardBusiness: row.ward_business || [],
    stakeBusiness: !!row.stake_business,
    sacramentHymn: row.sacrament_hymn,
    speakers: row.speakers || [],
    closingHymn: row.closing_hymn,
    closingPrayer: row.closing_prayer,
  };
}

/**
 * Retrieve sacrament meetings, optionally filtered by a specific date.
 */
export async function getMeetings(date?: string): Promise<SacramentMeeting[]> {
  let rows: DatabaseMeetingRow[];
  if (date) {
    rows = (await sql`SELECT * FROM meetings WHERE date = ${date} ORDER BY date ASC`) as DatabaseMeetingRow[];
  } else {
    rows = (await sql`SELECT * FROM meetings ORDER BY date ASC`) as DatabaseMeetingRow[];
  }
  return rows.map(mapRowToMeeting);
}

/**
 * Retrieve a specific sacrament meeting by its ID.
 */
export async function getMeetingById(id: number): Promise<SacramentMeeting | undefined> {
  const rows = (await sql`SELECT * FROM meetings WHERE id = ${id}`) as DatabaseMeetingRow[];
  if (rows.length === 0) {
    return undefined;
  }
  return mapRowToMeeting(rows[0]);
}

/**
 * Retrieves the current/active sacrament meeting.
 * Matches today's date if possible, otherwise returns the closest upcoming meeting,
 * and falls back to the most recent past meeting if all dates are in the past.
 */
export async function getCurrentMeeting(): Promise<SacramentMeeting | undefined> {
  const todayStr = formatDate(new Date());

  // Try to find upcoming or current meetings (today or in the future)
  const upcoming = (await sql`
    SELECT * FROM meetings 
    WHERE date >= ${todayStr} 
    ORDER BY date ASC 
    LIMIT 1
  `) as DatabaseMeetingRow[];

  if (upcoming.length > 0) {
    return mapRowToMeeting(upcoming[0]);
  }

  // Fallback: Return the most recent past meeting (descending sort)
  const past = (await sql`
    SELECT * FROM meetings 
    ORDER BY date DESC 
    LIMIT 1
  `) as DatabaseMeetingRow[];

  if (past.length > 0) {
    return mapRowToMeeting(past[0]);
  }

  return undefined;
}

/**
 * Simple search query across speaker names, topics, dates, types, hymns, and prayers.
 */
export async function searchMeetings(query: string): Promise<SacramentMeeting[]> {
  const q = query.toLowerCase().trim();
  if (!q) {
    return getMeetings();
  }

  const q_like = `%${q}%`;
  const rows = (await sql`
    SELECT * FROM meetings
    WHERE
      presiding ILIKE ${q_like} OR
      conducting ILIKE ${q_like} OR
      meeting_type ILIKE ${q_like} OR
      date::text ILIKE ${q_like} OR
      opening_prayer ILIKE ${q_like} OR
      closing_prayer ILIKE ${q_like} OR
      announcements::text ILIKE ${q_like} OR
      opening_hymn::text ILIKE ${q_like} OR
      sacrament_hymn::text ILIKE ${q_like} OR
      closing_hymn::text ILIKE ${q_like} OR
      speakers::text ILIKE ${q_like}
    ORDER BY date ASC
  `) as DatabaseMeetingRow[];

  return rows.map(mapRowToMeeting);
}

/**
 * Add a new sacrament meeting. (Stub - wired to DB in Week 04)
 */
export async function createMeeting(meeting: Omit<SacramentMeeting, 'id'>): Promise<SacramentMeeting> {
  return {
    ...meeting,
    id: 999
  };
}

// Keep signature alias for addMeeting if needed
export const addMeeting = createMeeting;

/**
 * Update an existing sacrament meeting by ID. (Stub - wired to DB in Week 04)
 */
export async function updateMeeting(
  id: number,
  updates: Partial<Omit<SacramentMeeting, 'id'>>
): Promise<SacramentMeeting | undefined> {
  void id;
  void updates;
  return undefined;
}

/**
 * Delete a sacrament meeting by ID. (Stub - wired to DB in Week 04)
 */
export async function deleteMeeting(id: number): Promise<boolean> {
  void id;
  return false;
}
