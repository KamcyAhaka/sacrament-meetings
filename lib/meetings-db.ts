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
 * Retrieve sacrament meetings, optionally filtered by search query or legacy date, and optionally paginated.
 */
export async function getMeetings(queryOrDate?: string, page?: number): Promise<SacramentMeeting[]> {
  // If it is a date format YYYY-MM-DD, maintain legacy behavior (filter by date, ignore page)
  if (queryOrDate && /^\d{4}-\d{2}-\d{2}$/.test(queryOrDate)) {
    const rows = (await sql`SELECT * FROM meetings WHERE date = ${queryOrDate} ORDER BY date ASC`) as DatabaseMeetingRow[];
    return rows.map(mapRowToMeeting);
  }

  const q = queryOrDate?.toLowerCase().trim() || '';
  const q_like = `%${q}%`;

  // If page is not specified, return all matching records (API compatibility)
  if (page === undefined || page === null) {
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

  // Query with pagination (6 records per page)
  const PAGE_SIZE = 6;
  const offset = (page - 1) * PAGE_SIZE;

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
    LIMIT ${PAGE_SIZE} OFFSET ${offset}
  `) as DatabaseMeetingRow[];

  return rows.map(mapRowToMeeting);
}

/**
 * Retrieve total number of pages for paginated sacrament meetings based on search query.
 */
export async function getMeetingsTotalPages(query?: string): Promise<number> {
  const PAGE_SIZE = 6;
  const q = query?.toLowerCase().trim() || '';
  const q_like = `%${q}%`;

  const countResult = await sql`
    SELECT COUNT(*) as count FROM meetings
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
  `;

  const total = Number(countResult[0]?.count || 0);
  return Math.ceil(total / PAGE_SIZE);
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
  const rows = (await sql`
    INSERT INTO meetings (
      date,
      meeting_type,
      presiding,
      conducting,
      announcements,
      opening_hymn,
      opening_prayer,
      ward_business,
      stake_business,
      sacrament_hymn,
      speakers,
      closing_hymn,
      closing_prayer
    ) VALUES (
      ${meeting.date},
      ${meeting.meetingType},
      ${meeting.presiding},
      ${meeting.conducting},
      ${meeting.announcements || null},
      ${meeting.openingHymn ? JSON.stringify(meeting.openingHymn) : null},
      ${meeting.openingPrayer},
      ${meeting.wardBusiness ? JSON.stringify(meeting.wardBusiness) : null},
      ${meeting.stakeBusiness},
      ${meeting.sacramentHymn ? JSON.stringify(meeting.sacramentHymn) : null},
      ${meeting.speakers ? JSON.stringify(meeting.speakers) : null},
      ${meeting.closingHymn ? JSON.stringify(meeting.closingHymn) : null},
      ${meeting.closingPrayer}
    )
    RETURNING *
  `) as DatabaseMeetingRow[];

  if (rows.length === 0) {
    throw new Error('Failed to create meeting');
  }
  return mapRowToMeeting(rows[0]);
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
  const current = await getMeetingById(id);
  if (!current) {
    return undefined;
  }

  const merged = {
    ...current,
    ...updates,
  };

  const rows = (await sql`
    UPDATE meetings
    SET
      date = ${merged.date},
      meeting_type = ${merged.meetingType},
      presiding = ${merged.presiding},
      conducting = ${merged.conducting},
      announcements = ${merged.announcements || null},
      opening_hymn = ${merged.openingHymn ? JSON.stringify(merged.openingHymn) : null},
      opening_prayer = ${merged.openingPrayer},
      ward_business = ${merged.wardBusiness ? JSON.stringify(merged.wardBusiness) : null},
      stake_business = ${merged.stakeBusiness},
      sacrament_hymn = ${merged.sacramentHymn ? JSON.stringify(merged.sacramentHymn) : null},
      speakers = ${merged.speakers ? JSON.stringify(merged.speakers) : null},
      closing_hymn = ${merged.closingHymn ? JSON.stringify(merged.closingHymn) : null},
      closing_prayer = ${merged.closingPrayer}
    WHERE id = ${id}
    RETURNING *
  `) as DatabaseMeetingRow[];

  if (rows.length === 0) {
    return undefined;
  }
  return mapRowToMeeting(rows[0]);
}

/**
 * Delete a sacrament meeting by ID. (Stub - wired to DB in Week 04)
 */
export async function deleteMeeting(id: number): Promise<boolean> {
  const result = await sql`
    DELETE FROM meetings
    WHERE id = ${id}
    RETURNING id
  `;
  return result.length > 0;
}
