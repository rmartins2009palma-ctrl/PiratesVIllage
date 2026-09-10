// Central mock data for the Pirates Village Kids Club console.
// Times use 24-hour "HH:MM" strings; dates use ISO so we can format as DD/MM/YYYY.

export type KidStatus = "in" | "out"

export type Relationship =
  | "Mother"
  | "Father"
  | "Grandmother"
  | "Grandfather"
  | "Other"

export interface Guardian {
  id: string
  fullName: string
  phone: string
  relationship: Relationship
  isPrimary: boolean
  email?: string
  /** ISO date the guardian signed the consent form (primary guardians) */
  consentSignedOn?: string
  /** ISO date an additional authorized adult was added to the file */
  addedOn?: string
  /** Check-ins / check-outs this guardian has signed during the current stay */
  signaturesThisStay?: number
}

/** "anomaly" flags a completed visit that needs a second look (late pickup, etc.) */
export type VisitStatus = "completed" | "ongoing" | "anomaly"

export interface Visit {
  id: string
  /** ISO date, e.g. 2026-09-10 */
  date: string
  checkIn: string
  checkOut: string | null
  /** minutes, null while still in club */
  durationMinutes: number | null
  signedBy: string
  /** Animator who recorded the visit */
  registeredBy?: string
  /** Derived from checkOut when absent — see visitStatus() */
  status?: VisitStatus
  /** Why the visit was flagged; only meaningful when status === "anomaly" */
  anomalyReason?: string
}

export interface StaffNote {
  id: string
  author: string
  timestamp: string
  text: string
}

export interface ConsentRecord {
  version: string
  signedBy: string
  /** ISO date */
  signedOn: string
  method: string
}

export interface Kid {
  id: string
  firstName: string
  lastName: string
  age: number
  room: string
  status: KidStatus
  /** HH:MM of current entry, only meaningful when status === "in" */
  entryTime?: string
  allergies?: string
  medical?: string
  /** Illness or disability declared at registration */
  disability?: string
  notes?: string
  registeredOn: string
  /** Animator who took the registration */
  registeredBy?: string
  nationality?: string
  language?: string
  season?: string
  consent?: ConsentRecord
  lastVisit: string
  visitsThisStay: number
  guardians: Guardian[]
  history: Visit[]
  staffNotes: StaffNote[]
}

export const HOTEL = {
  name: "Pirates Village",
  club: "Kids Club",
  location: "Santa Ponsa, Mallorca",
}

export const CURRENT_USER = {
  name: "Marina Costa",
  role: "Lead Animator",
  initials: "MC",
}

function initials(first: string, last: string) {
  return `${first[0]}${last[0]}`.toUpperCase()
}

export function kidInitials(kid: Pick<Kid, "firstName" | "lastName">) {
  return initials(kid.firstName, kid.lastName)
}

export function fullName(kid: Pick<Kid, "firstName" | "lastName">) {
  return `${kid.firstName} ${kid.lastName}`
}

export const KIDS: Kid[] = [
  {
    id: "k1",
    firstName: "Emma",
    lastName: "Thompson",
    age: 6,
    room: "214",
    status: "in",
    entryTime: "09:45",
    allergies: "Peanuts, tree nuts — carries an EpiPen at reception, dairy intolerant",
    registeredOn: "2026-09-05",
    registeredBy: "Marina Costa",
    nationality: "British",
    language: "English",
    season: "Summer 2026",
    consent: {
      version: "Terms v.1.2 — 09/2026",
      signedBy: "Sarah Thompson",
      signedOn: "2026-09-05",
      method: "Handwritten signature on tablet",
    },
    lastVisit: "2026-09-10",
    visitsThisStay: 8,
    guardians: [
      {
        id: "g1",
        fullName: "Sarah Thompson",
        phone: "+44 7375 863237",
        email: "sarah.thompson@example.com",
        relationship: "Mother",
        isPrimary: true,
        consentSignedOn: "2026-09-05",
        signaturesThisStay: 12,
      },
      {
        id: "g2",
        fullName: "Mark Thompson",
        phone: "+44 7375 863238",
        email: "mark.thompson@example.com",
        relationship: "Father",
        isPrimary: false,
        addedOn: "2026-09-06",
        signaturesThisStay: 3,
      },
    ],
    history: [
      { id: "v1", date: "2026-09-10", checkIn: "09:45", checkOut: null, durationMinutes: null, signedBy: "Sarah Thompson", registeredBy: "Marina Costa", status: "ongoing" },
      { id: "v1b", date: "2026-09-10", checkIn: "07:30", checkOut: "08:50", durationMinutes: 80, signedBy: "Mark Thompson", registeredBy: "Tom Becker" },
      { id: "v2", date: "2026-09-09", checkIn: "15:20", checkOut: "18:40", durationMinutes: 200, signedBy: "Sarah Thompson", registeredBy: "Marina Costa" },
      { id: "v2b", date: "2026-09-09", checkIn: "10:10", checkOut: "12:30", durationMinutes: 140, signedBy: "Sarah Thompson", registeredBy: "Marina Costa" },
      {
        id: "v3",
        date: "2026-09-08",
        checkIn: "16:05",
        checkOut: "18:15",
        durationMinutes: 130,
        signedBy: "Mark Thompson",
        registeredBy: "Tom Becker",
        status: "anomaly",
        anomalyReason: "Collected 15 minutes after the club's 18:00 closing time.",
      },
      { id: "v3b", date: "2026-09-08", checkIn: "09:30", checkOut: "12:00", durationMinutes: 150, signedBy: "Sarah Thompson", registeredBy: "Marina Costa" },
      { id: "v4", date: "2026-09-06", checkIn: "10:00", checkOut: "14:20", durationMinutes: 260, signedBy: "Sarah Thompson", registeredBy: "Marina Costa" },
      { id: "v5", date: "2026-09-05", checkIn: "14:00", checkOut: "15:30", durationMinutes: 90, signedBy: "Sarah Thompson", registeredBy: "Marina Costa" },
    ],
    staffNotes: [
      { id: "n1", author: "Marina Costa", timestamp: "2026-09-08 16:20", text: "Loves the treasure hunt activity. Very shy at first, warms up quickly. Prefers quieter craft corners over loud group games." },
      { id: "n1b", author: "Tom Becker", timestamp: "2026-09-07 11:05", text: "Excellent with younger children — helped Zara settle in during storytime. Natural little leader." },
      { id: "n1c", author: "Marina Costa", timestamp: "2026-09-05 10:15", text: "First day aboard. Sarah handed the EpiPen to reception — stored in the red medical box. Emma knows how to flag a reaction herself." },
    ],
  },
  {
    id: "k2",
    firstName: "James",
    lastName: "Wilson",
    age: 9,
    room: "108",
    status: "in",
    entryTime: "10:20",
    registeredOn: "2026-09-09",
    lastVisit: "2026-09-10",
    visitsThisStay: 2,
    guardians: [
      { id: "g3", fullName: "Laura Wilson", phone: "+44 7911 123456", relationship: "Mother", isPrimary: true },
    ],
    history: [
      { id: "v4", date: "2026-09-10", checkIn: "10:20", checkOut: null, durationMinutes: null, signedBy: "Laura Wilson" },
      { id: "v5", date: "2026-09-09", checkIn: "11:00", checkOut: "13:00", durationMinutes: 120, signedBy: "Laura Wilson" },
    ],
    staffNotes: [],
  },
  {
    id: "k3",
    firstName: "Sofia",
    lastName: "Martinez",
    age: 5,
    room: "322",
    status: "in",
    entryTime: "11:05",
    allergies: "Lactose intolerant.",
    notes: "Prefers activities in Spanish.",
    registeredOn: "2026-09-06",
    lastVisit: "2026-09-10",
    visitsThisStay: 9,
    guardians: [
      { id: "g4", fullName: "Carmen Martinez", phone: "+34 612 345 678", relationship: "Mother", isPrimary: true },
      { id: "g5", fullName: "Rosa Delgado", phone: "+34 655 987 321", relationship: "Grandmother", isPrimary: false },
    ],
    history: [
      { id: "v6", date: "2026-09-10", checkIn: "11:05", checkOut: null, durationMinutes: null, signedBy: "Carmen Martinez" },
      { id: "v7", date: "2026-09-09", checkIn: "09:30", checkOut: "12:00", durationMinutes: 150, signedBy: "Rosa Delgado" },
    ],
    staffNotes: [
      { id: "n2", author: "Tom Becker", timestamp: "2026-09-07 10:40", text: "Great swimmer — cleared for pool games with supervision." },
    ],
  },
  {
    id: "k4",
    firstName: "Lucas",
    lastName: "Müller",
    age: 8,
    room: "417",
    status: "in",
    entryTime: "09:30",
    medical: "Mild asthma — inhaler kept in the blue pouch at reception.",
    registeredOn: "2026-09-08",
    lastVisit: "2026-09-10",
    visitsThisStay: 4,
    guardians: [
      { id: "g6", fullName: "Anna Müller", phone: "+49 151 23456789", relationship: "Mother", isPrimary: true },
    ],
    history: [
      { id: "v8", date: "2026-09-10", checkIn: "09:30", checkOut: null, durationMinutes: null, signedBy: "Anna Müller" },
    ],
    staffNotes: [],
  },
  {
    id: "k5",
    firstName: "Chloé",
    lastName: "Dubois",
    age: 7,
    room: "231",
    status: "in",
    entryTime: "10:50",
    registeredOn: "2026-09-09",
    lastVisit: "2026-09-10",
    visitsThisStay: 3,
    guardians: [
      { id: "g7", fullName: "Julien Dubois", phone: "+33 6 12 34 56 78", relationship: "Father", isPrimary: true },
    ],
    history: [
      { id: "v9", date: "2026-09-10", checkIn: "10:50", checkOut: null, durationMinutes: null, signedBy: "Julien Dubois" },
    ],
    staffNotes: [],
  },
  {
    id: "k6",
    firstName: "Noah",
    lastName: "Andersson",
    age: 10,
    room: "115",
    status: "out",
    registeredOn: "2026-09-05",
    lastVisit: "2026-09-10",
    visitsThisStay: 11,
    guardians: [
      { id: "g8", fullName: "Erik Andersson", phone: "+46 70 123 45 67", relationship: "Father", isPrimary: true },
    ],
    history: [
      { id: "v10", date: "2026-09-10", checkIn: "09:00", checkOut: "11:20", durationMinutes: 140, signedBy: "Erik Andersson" },
    ],
    staffNotes: [],
  },
  {
    id: "k7",
    firstName: "Aisha",
    lastName: "Khan",
    age: 6,
    room: "309",
    status: "out",
    registeredOn: "2026-09-08",
    lastVisit: "2026-09-10",
    visitsThisStay: 3,
    guardians: [
      { id: "g9", fullName: "Nadia Khan", phone: "+44 7822 445566", relationship: "Mother", isPrimary: true },
    ],
    history: [
      { id: "v11", date: "2026-09-10", checkIn: "14:00", checkOut: "16:30", durationMinutes: 150, signedBy: "Nadia Khan" },
    ],
    staffNotes: [],
  },
  {
    id: "k8",
    firstName: "Marco",
    lastName: "Rossi",
    age: 11,
    room: "402",
    status: "out",
    registeredOn: "2026-09-07",
    lastVisit: "2026-09-09",
    visitsThisStay: 5,
    guardians: [
      { id: "g10", fullName: "Giulia Rossi", phone: "+39 320 123 4567", relationship: "Mother", isPrimary: true },
    ],
    history: [
      { id: "v12", date: "2026-09-09", checkIn: "15:30", checkOut: "17:45", durationMinutes: 135, signedBy: "Giulia Rossi" },
    ],
    staffNotes: [],
  },
  {
    id: "k9",
    firstName: "Oliver",
    lastName: "Thompson",
    age: 4,
    room: "214",
    status: "in",
    entryTime: "09:50",
    allergies: "Gluten sensitivity.",
    registeredOn: "2026-09-10",
    registeredBy: "Marina Costa",
    nationality: "British",
    language: "English",
    season: "Summer 2026",
    consent: {
      version: "Terms v.1.2 — 09/2026",
      signedBy: "Sarah Thompson",
      signedOn: "2026-09-10",
      method: "Handwritten signature on tablet",
    },
    lastVisit: "2026-09-10",
    visitsThisStay: 1,
    guardians: [
      {
        id: "g11",
        fullName: "Sarah Thompson",
        phone: "+44 7375 863237",
        email: "sarah.thompson@example.com",
        relationship: "Mother",
        isPrimary: true,
        consentSignedOn: "2026-09-10",
        signaturesThisStay: 1,
      },
      {
        id: "g12",
        fullName: "Mark Thompson",
        phone: "+44 7375 863238",
        email: "mark.thompson@example.com",
        relationship: "Father",
        isPrimary: false,
        addedOn: "2026-09-10",
        signaturesThisStay: 0,
      },
    ],
    history: [
      { id: "v13", date: "2026-09-10", checkIn: "09:50", checkOut: null, durationMinutes: null, signedBy: "Sarah Thompson", registeredBy: "Marina Costa", status: "ongoing" },
    ],
    staffNotes: [],
  },
  {
    id: "k10",
    firstName: "Mia",
    lastName: "Fernández",
    age: 7,
    room: "156",
    status: "out",
    registeredOn: "2026-09-04",
    lastVisit: "2026-09-09",
    visitsThisStay: 6,
    guardians: [
      { id: "g13", fullName: "Lucía Fernández", phone: "+34 600 123 456", relationship: "Mother", isPrimary: true },
    ],
    history: [
      { id: "v14", date: "2026-09-09", checkIn: "10:00", checkOut: "12:15", durationMinutes: 135, signedBy: "Lucía Fernández" },
    ],
    staffNotes: [],
  },
  {
    id: "k11",
    firstName: "Liam",
    lastName: "O'Brien",
    age: 9,
    room: "203",
    status: "in",
    entryTime: "08:15",
    medical: "Type 1 diabetes — insulin pump. Monitor snacks.",
    registeredOn: "2026-09-03",
    lastVisit: "2026-09-10",
    visitsThisStay: 14,
    guardians: [
      { id: "g14", fullName: "Sean O'Brien", phone: "+353 87 123 4567", relationship: "Father", isPrimary: true },
      { id: "g15", fullName: "Aoife O'Brien", phone: "+353 87 765 4321", relationship: "Mother", isPrimary: false },
    ],
    history: [
      { id: "v15", date: "2026-09-10", checkIn: "08:15", checkOut: null, durationMinutes: null, signedBy: "Sean O'Brien" },
      { id: "v16", date: "2026-09-09", checkIn: "08:30", checkOut: "11:00", durationMinutes: 150, signedBy: "Aoife O'Brien" },
    ],
    staffNotes: [
      { id: "n3", author: "Marina Costa", timestamp: "2026-09-05 09:00", text: "Very independent. Knows his pump routine well. Loves LEGO." },
    ],
  },
  {
    id: "k12",
    firstName: "Hanna",
    lastName: "Bergström",
    age: 5,
    room: "387",
    status: "out",
    registeredOn: "2026-09-06",
    lastVisit: "2026-09-08",
    visitsThisStay: 4,
    guardians: [
      { id: "g16", fullName: "Karin Bergström", phone: "+46 73 987 65 43", relationship: "Mother", isPrimary: true },
    ],
    history: [
      { id: "v17", date: "2026-09-08", checkIn: "14:00", checkOut: "16:30", durationMinutes: 150, signedBy: "Karin Bergström" },
    ],
    staffNotes: [],
  },
  {
    id: "k13",
    firstName: "Diego",
    lastName: "Santos",
    age: 10,
    room: "411",
    status: "in",
    entryTime: "10:00",
    allergies: "Shellfish allergy — severe.",
    registeredOn: "2026-09-05",
    lastVisit: "2026-09-10",
    visitsThisStay: 8,
    guardians: [
      { id: "g17", fullName: "Carlos Santos", phone: "+34 677 222 333", relationship: "Father", isPrimary: true },
    ],
    history: [
      { id: "v18", date: "2026-09-10", checkIn: "10:00", checkOut: null, durationMinutes: null, signedBy: "Carlos Santos" },
      { id: "v19", date: "2026-09-09", checkIn: "09:15", checkOut: "12:00", durationMinutes: 165, signedBy: "Carlos Santos" },
    ],
    staffNotes: [],
  },
  {
    id: "k14",
    firstName: "Grace",
    lastName: "Walsh",
    age: 3,
    room: "172",
    status: "out",
    notes: "Needs help with shoes. Very attached to her blanket.",
    registeredOn: "2026-09-09",
    lastVisit: "2026-09-10",
    visitsThisStay: 2,
    guardians: [
      { id: "g18", fullName: "Patrick Walsh", phone: "+44 7790 112233", relationship: "Father", isPrimary: true },
      { id: "g19", fullName: "Emily Walsh", phone: "+44 7790 445566", relationship: "Mother", isPrimary: false },
    ],
    history: [
      { id: "v20", date: "2026-09-10", checkIn: "13:30", checkOut: "15:00", durationMinutes: 90, signedBy: "Emily Walsh" },
    ],
    staffNotes: [],
  },
  {
    id: "k15",
    firstName: "Felix",
    lastName: "Schmidt",
    age: 8,
    room: "417",
    status: "in",
    entryTime: "09:35",
    registeredOn: "2026-09-08",
    lastVisit: "2026-09-10",
    visitsThisStay: 3,
    guardians: [
      { id: "g20", fullName: "Nina Schmidt", phone: "+49 152 9988 7766", relationship: "Mother", isPrimary: true },
    ],
    history: [
      { id: "v21", date: "2026-09-10", checkIn: "09:35", checkOut: null, durationMinutes: null, signedBy: "Nina Schmidt" },
    ],
    staffNotes: [],
  },
  {
    id: "k16",
    firstName: "Isabella",
    lastName: "Romano",
    age: 6,
    room: "345",
    status: "out",
    allergies: "Egg allergy — mild.",
    registeredOn: "2026-09-02",
    lastVisit: "2026-09-07",
    visitsThisStay: 10,
    guardians: [
      { id: "g21", fullName: "Francesca Romano", phone: "+39 333 444 5555", relationship: "Mother", isPrimary: true },
    ],
    history: [
      { id: "v22", date: "2026-09-07", checkIn: "10:00", checkOut: "13:00", durationMinutes: 180, signedBy: "Francesca Romano" },
    ],
    staffNotes: [],
  },
  {
    id: "k17",
    firstName: "Henry",
    lastName: "Clarke",
    age: 12,
    room: "128",
    status: "out",
    registeredOn: "2026-09-01",
    lastVisit: "2026-09-09",
    visitsThisStay: 12,
    guardians: [
      { id: "g22", fullName: "Gemma Clarke", phone: "+44 7788 990011", relationship: "Mother", isPrimary: true },
    ],
    history: [
      { id: "v23", date: "2026-09-09", checkIn: "14:00", checkOut: "17:30", durationMinutes: 210, signedBy: "Gemma Clarke" },
    ],
    staffNotes: [],
  },
  {
    id: "k18",
    firstName: "Zara",
    lastName: "Ahmed",
    age: 4,
    room: "264",
    status: "in",
    entryTime: "11:30",
    medical: "Epilsepsy — rescue medication in club first-aid kit.",
    registeredOn: "2026-09-10",
    lastVisit: "2026-09-10",
    visitsThisStay: 1,
    guardians: [
      { id: "g23", fullName: "Yasmin Ahmed", phone: "+44 7555 666 777", relationship: "Mother", isPrimary: true },
      { id: "g24", fullName: "Omar Ahmed", phone: "+44 7555 888 999", relationship: "Father", isPrimary: false },
    ],
    history: [
      { id: "v24", date: "2026-09-10", checkIn: "11:30", checkOut: null, durationMinutes: null, signedBy: "Yasmin Ahmed" },
    ],
    staffNotes: [],
  },
]

export type ActivityType = "in" | "out" | "registered"

export interface ActivityEvent {
  id: string
  type: ActivityType
  kidName: string
  time: string
  guardian?: string
}

export const RECENT_ACTIVITY: ActivityEvent[] = [
  { id: "a1", type: "in", kidName: "Sofia Martinez", time: "11:05", guardian: "Carmen Martinez" },
  { id: "a2", type: "out", kidName: "Noah Andersson", time: "11:20", guardian: "Erik Andersson" },
  { id: "a3", type: "in", kidName: "Chloé Dubois", time: "10:50", guardian: "Julien Dubois" },
  { id: "a4", type: "in", kidName: "James Wilson", time: "10:20", guardian: "Laura Wilson" },
  { id: "a5", type: "registered", kidName: "Chloé Dubois", time: "10:18" },
  { id: "a6", type: "in", kidName: "Emma Thompson", time: "09:45", guardian: "Sarah Thompson" },
  { id: "a7", type: "in", kidName: "Lucas Müller", time: "09:30", guardian: "Anna Müller" },
  { id: "a8", type: "out", kidName: "Aisha Khan", time: "09:15", guardian: "Nadia Khan" },
]

export const TODAY_STATS = {
  totalVisits: 14,
  averageStayMinutes: 138,
  uniqueKids: 11,
}

export function formatDuration(minutes: number | null): string {
  if (minutes == null) return "—"
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-")
  return `${d}/${m}/${y}`
}

/** Older records predate the status field — a missing check-out means still aboard. */
export function visitStatus(visit: Visit): VisitStatus {
  return visit.status ?? (visit.checkOut === null ? "ongoing" : "completed")
}

export function primaryGuardian(kid: Pick<Kid, "guardians">): Guardian | undefined {
  return kid.guardians.find((g) => g.isPrimary) ?? kid.guardians[0]
}

function surname(fullName: string): string {
  const parts = fullName.trim().split(/\s+/)
  return (parts[parts.length - 1] ?? "").toLowerCase()
}

/**
 * Siblings share a room and a primary-guardian surname. The child themselves is
 * never returned, so the count reads as "how many other children in this family".
 */
export function getSiblings(kid: Kid): Kid[] {
  const mine = primaryGuardian(kid)
  if (!mine) return []
  const familyName = surname(mine.fullName)
  return KIDS.filter((other) => {
    if (other.id === kid.id) return false
    if (other.room !== kid.room) return false
    const theirs = primaryGuardian(other)
    return theirs ? surname(theirs.fullName) === familyName : false
  })
}

export interface VisitStats {
  total: number
  averageMinutes: number | null
  longestMinutes: number | null
  favoriteWindow: string
}

/** Buckets check-in times so the Quick stats card can name a favourite window. */
export function getVisitStats(kid: Kid): VisitStats {
  const finished = kid.history.filter((v) => v.durationMinutes != null)
  const durations = finished.map((v) => v.durationMinutes as number)
  const total = durations.reduce((sum, d) => sum + d, 0)

  const buckets = { Mornings: 0, Afternoons: 0, Evenings: 0 }
  for (const visit of kid.history) {
    const hour = Number(visit.checkIn.split(":")[0])
    if (hour < 12) buckets.Mornings += 1
    else if (hour < 17) buckets.Afternoons += 1
    else buckets.Evenings += 1
  }

  const [label, count] = Object.entries(buckets).sort((a, b) => b[1] - a[1])[0]
  const range = { Mornings: "09:00–12:00", Afternoons: "12:00–17:00", Evenings: "after 17:00" }[
    label as keyof typeof buckets
  ]

  return {
    total: kid.history.length,
    averageMinutes: durations.length ? Math.round(total / durations.length) : null,
    longestMinutes: durations.length ? Math.max(...durations) : null,
    favoriteWindow: count === 0 ? "Not enough visits yet" : `${label} (mostly ${range})`,
  }
}
