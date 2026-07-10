import { SacramentMeeting } from './types';

// Initial mock data of five sacrament meetings with realistic LDS content.
const initialMeetings: SacramentMeeting[] = [
  {
    id: 1,
    date: '2026-07-05',
    meetingType: 'testimony',
    presiding: 'Bishop John Smith',
    conducting: 'Brother Marcus Vance (First Counselor)',
    announcements: [
      'Ward Temple Day this Thursday at 7:00 PM.',
      'Youth Camp registration is open until July 15th.',
      'Stake Self-Reliance class begins next Tuesday at 6:30 PM.'
    ],
    openingHymn: { number: 5, title: 'High on the Mountain Top' },
    openingPrayer: 'Sister Sarah Jenkins',
    wardBusiness: [
      { description: 'Release of Sister Linda Johnson as a Sunday School teacher.' },
      { description: 'Sustaining of Sister Rebecca Miller as a Sunday School teacher.' }
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 172, title: 'In Humility, Our Savior' },
    speakers: [], // Fast and Testimony meeting is open to the congregation
    closingHymn: { number: 166, title: 'Abide with Me!' },
    closingPrayer: 'Brother David Miller'
  },
  {
    id: 2,
    date: '2026-07-12',
    meetingType: 'regular',
    presiding: 'Bishop John Smith',
    conducting: 'Brother Aaron Davis (Second Counselor)',
    announcements: [
      'Ward Choir practice resumes next Sunday at 1:30 PM in the chapel.',
      'Please sign up for building cleaning for the month of July.'
    ],
    openingHymn: { number: 2, title: 'The Spirit of God' },
    openingPrayer: 'Sister Karen Thomas',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 195, title: 'How Great the Wisdom and the Love' },
    speakers: [
      {
        name: 'Brother Thomas Green',
        topic: 'The Power of Daily Scripture Study',
        type: 'speaker'
      },
      {
        name: 'Sister Emily Young',
        topic: 'Finding Peace in Christ',
        type: 'speaker'
      }
    ],
    closingHymn: { number: 19, title: 'We Thank Thee, O God, for a Prophet' },
    closingPrayer: 'Brother James Taylor'
  },
  {
    id: 3,
    date: '2026-07-19',
    meetingType: 'regular',
    presiding: 'Bishop John Smith',
    conducting: 'Bishop John Smith',
    announcements: [
      'Stake Youth Devotional on Sunday evening at 6:00 PM at the Stake Center.'
    ],
    openingHymn: { number: 30, title: 'Come, Come, Ye Saints' },
    openingPrayer: 'Brother Benjamin Clark',
    wardBusiness: [
      { description: 'Ordination of Brother Jacob Davis to the office of Priest.' }
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: 'As Now We Take the Sacrament' },
    speakers: [
      {
        name: 'Sister Lily Adams',
        topic: 'Serving Others with a Willing Heart',
        type: 'speaker'
      },
      {
        name: 'Ward Youth Choir',
        topic: 'I Feel My Savior\'s Love',
        type: 'musical-number'
      },
      {
        name: 'Brother Jacob Peterson',
        topic: 'Standing as a Witness of God',
        type: 'speaker'
      }
    ],
    closingHymn: { number: 3, title: 'Now Let Us Rejoice' },
    closingPrayer: 'Sister Chloe Hall'
  },
  {
    id: 4,
    date: '2026-07-26',
    meetingType: 'regular',
    presiding: 'President Richard Croft (Stake President)',
    conducting: 'Bishop John Smith',
    announcements: [
      'Ward Linger Longer after next week\'s meeting. Please bring a light finger food to share.'
    ],
    openingHymn: { number: 26, title: 'Joseph Smith\'s First Prayer' },
    openingPrayer: 'Sister Maria Garcia',
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 193, title: 'I Stand All Amazed' },
    speakers: [
      {
        name: 'Sister Clara Hughes',
        topic: 'Developing Christlike Love in Our Homes',
        type: 'speaker'
      },
      {
        name: 'President Richard Croft',
        topic: 'Building Stronger Families through Covenant Keeping',
        type: 'speaker'
      }
    ],
    closingHymn: { number: 100, title: 'Nearer, My God, to Thee' },
    closingPrayer: 'Brother Samuel White'
  },
  {
    id: 5,
    date: '2026-08-02',
    meetingType: 'stake',
    presiding: 'Elder Robert C. Gay (General Authority Seventy)',
    conducting: 'President Richard Croft (Stake President)',
    announcements: [
      'No local ward meetings will be held next week due to Stake Conference at the Stake Center.'
    ],
    openingHymn: { number: 136, title: 'I Know That My Redeemer Lives' },
    openingPrayer: 'Sister Laura Kim',
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 181, title: 'Jesus of Nazareth, Savior and King' },
    speakers: [
      {
        name: 'Sister Sarah Bennett (Stake Young Women President)',
        topic: 'Nurturing the Faith of the Rising Generation',
        type: 'speaker'
      },
      {
        name: 'Brother Mark Evans',
        topic: 'Heeding the Voice of the Living Prophets',
        type: 'speaker'
      },
      {
        name: 'Elder Robert C. Gay',
        topic: 'The Atonement of Jesus Christ and Personal Change',
        type: 'speaker'
      }
    ],
    closingHymn: { number: 85, title: 'How Firm a Foundation' },
    closingPrayer: 'Brother Alan Rogers'
  }
];

// Local in-memory array to store meetings
const db: SacramentMeeting[] = [...initialMeetings];

// Helper to generate a new unique ID
function getNextId(): number {
  return db.length > 0 ? Math.max(...db.map(m => m.id)) + 1 : 1;
}

export async function getAllMeetings(): Promise<SacramentMeeting[]> {
  return [...db].sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Retrieve sacrament meetings, optionally filtered by a specific date.
 */
export async function getMeetings(date?: string): Promise<SacramentMeeting[]> {
  const meetings = await getAllMeetings();
  if (date) {
    return meetings.filter(m => m.date === date);
  }
  return meetings;
}

/**
 * Retrieve a specific sacrament meeting by its ID.
 */
export async function getMeetingById(id: number): Promise<SacramentMeeting | undefined> {
  return db.find(m => m.id === id);
}

/**
 * Retrieves the current/active sacrament meeting.
 * Matches today's date if possible, otherwise returns the closest upcoming meeting,
 * and falls back to the most recent past meeting if all dates are in the past.
 */
export async function getCurrentMeeting(): Promise<SacramentMeeting | undefined> {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Try to find upcoming or current meetings (today or in the future)
  const upcoming = db
    .filter(m => m.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (upcoming.length > 0) {
    return upcoming[0];
  }

  // Fallback: Return the most recent past meeting (descending sort)
  if (db.length > 0) {
    const past = [...db].sort((a, b) => b.date.localeCompare(a.date));
    return past[0];
  }

  return undefined;
}

/**
 * Simple search query across speaker names, topics, dates, types, hymns, and prayers.
 */
export async function searchMeetings(query: string): Promise<SacramentMeeting[]> {
  const q = query.toLowerCase().trim();
  if (!q) {
    return getAllMeetings();
  }

  const results = db.filter(m => {
    const matchesSpeaker = m.speakers.some(
      s => s.name.toLowerCase().includes(q) || s.topic.toLowerCase().includes(q)
    );
    const matchesAnnouncements = m.announcements?.some(a => a.toLowerCase().includes(q));
    const matchesHymns = [m.openingHymn, m.sacramentHymn, m.closingHymn].some(
      h => h.title.toLowerCase().includes(q) || h.number.toString().includes(q)
    );

    return (
      m.presiding.toLowerCase().includes(q) ||
      m.conducting.toLowerCase().includes(q) ||
      m.meetingType.toLowerCase().includes(q) ||
      m.date.includes(q) ||
      m.openingPrayer.toLowerCase().includes(q) ||
      m.closingPrayer.toLowerCase().includes(q) ||
      matchesSpeaker ||
      matchesAnnouncements ||
      matchesHymns
    );
  });

  return results.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Add a new sacrament meeting.
 */
export async function createMeeting(meeting: Omit<SacramentMeeting, 'id'>): Promise<SacramentMeeting> {
  const newMeeting: SacramentMeeting = {
    ...meeting,
    id: getNextId()
  };
  db.push(newMeeting);
  return newMeeting;
}

/**
 * Update an existing sacrament meeting by ID.
 */
export async function updateMeeting(
  id: number,
  updates: Partial<Omit<SacramentMeeting, 'id'>>
): Promise<SacramentMeeting | undefined> {
  const index = db.findIndex(m => m.id === id);
  if (index === -1) {
    return undefined;
  }

  const updatedMeeting = {
    ...db[index],
    ...updates
  };
  db[index] = updatedMeeting;
  return updatedMeeting;
}

/**
 * Delete a sacrament meeting by ID.
 */
export async function deleteMeeting(id: number): Promise<boolean> {
  const index = db.findIndex(m => m.id === id);
  if (index === -1) {
    return false;
  }
  db.splice(index, 1);
  return true;
}
