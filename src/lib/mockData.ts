// Mock data for the Meridian prototype. Deterministic, hand-authored — no backend.

export type Wing = "Magnolia" | "Birchwood" | "Cedar" | "Willow";

export type Floor = 1 | 2 | 3;

export interface StaffMember {
  id: string;
  name: string;
  role: "RN" | "LPN" | "CNA" | "Care Aide";
  wing: Wing;
  floor: Floor;
  x: number; // floor map position 0-100
  y: number;
  status: "available" | "with-resident" | "break" | "handover" | "overloaded";
  taskLoad: number; // 0-100
  hoursOnShift: number;
  stepsToday: number;
  lastCoverageGapMin: number;
  burnoutSignal: "none" | "watch" | "elevated";
}

export interface Resident {
  id: string;
  name: string;
  age: number;
  room: string;
  wing: Wing;
  floor: Floor;
  x: number;
  y: number;
  careLevel: "Independent" | "Assisted" | "Memory Care" | "Skilled Nursing";
  deteriorationRisk: number; // 0-100
  needsHelp: boolean;
  helpReason?: string;
  primaryConditions: string[];
  photoInitials: string;
}

export const staff: StaffMember[] = [
  { id: "s1", name: "Amara Okafor", role: "RN", wing: "Magnolia", floor: 1, x: 22, y: 34, status: "with-resident", taskLoad: 68, hoursOnShift: 6.2, stepsToday: 8400, lastCoverageGapMin: 4, burnoutSignal: "none" },
  { id: "s2", name: "Priya Nair", role: "RN", wing: "Birchwood", floor: 2, x: 61, y: 28, status: "overloaded", taskLoad: 94, hoursOnShift: 9.8, stepsToday: 13200, lastCoverageGapMin: 22, burnoutSignal: "elevated" },
  { id: "s3", name: "Deshawn Marsh", role: "CNA", wing: "Birchwood", floor: 1, x: 68, y: 52, status: "available", taskLoad: 41, hoursOnShift: 3.1, stepsToday: 5100, lastCoverageGapMin: 1, burnoutSignal: "none" },
  { id: "s4", name: "Lucia Fernandez", role: "LPN", wing: "Cedar", floor: 2, x: 40, y: 68, status: "handover", taskLoad: 55, hoursOnShift: 7.4, stepsToday: 9800, lastCoverageGapMin: 8, burnoutSignal: "watch" },
  { id: "s5", name: "Grace Tan", role: "CNA", wing: "Willow", floor: 1, x: 82, y: 71, status: "with-resident", taskLoad: 62, hoursOnShift: 5.5, stepsToday: 7600, lastCoverageGapMin: 3, burnoutSignal: "none" },
  { id: "s6", name: "Tobias Kraus", role: "Care Aide", wing: "Magnolia", floor: 3, x: 30, y: 55, status: "break", taskLoad: 30, hoursOnShift: 4.0, stepsToday: 4400, lastCoverageGapMin: 0, burnoutSignal: "none" },
  { id: "s7", name: "Marisol Ibarra", role: "RN", wing: "Cedar", floor: 3, x: 47, y: 40, status: "available", taskLoad: 48, hoursOnShift: 2.6, stepsToday: 3900, lastCoverageGapMin: 2, burnoutSignal: "none" },
  { id: "s8", name: "Femi Adeyemi", role: "LPN", wing: "Willow", floor: 2, x: 76, y: 30, status: "overloaded", taskLoad: 88, hoursOnShift: 10.4, stepsToday: 14100, lastCoverageGapMin: 31, burnoutSignal: "elevated" },
];

export const residents: Resident[] = [
  { id: "r1", name: "Eleanor Whitfield", age: 87, room: "M-104", wing: "Magnolia", floor: 1, x: 18, y: 40, careLevel: "Skilled Nursing", deteriorationRisk: 78, needsHelp: true, helpReason: "Call bell — pain reported 7/10", primaryConditions: ["CHF", "Stage 2 pressure injury"], photoInitials: "EW" },
  { id: "r2", name: "Harold Jensen", age: 91, room: "M-112", wing: "Magnolia", floor: 2, x: 26, y: 46, careLevel: "Memory Care", deteriorationRisk: 34, needsHelp: false, primaryConditions: ["Dementia", "Type 2 diabetes"], photoInitials: "HJ" },
  { id: "r3", name: "Beatrice Kim", age: 83, room: "B-201", wing: "Birchwood", floor: 1, x: 58, y: 22, careLevel: "Assisted", deteriorationRisk: 21, needsHelp: false, primaryConditions: ["Osteoarthritis"], photoInitials: "BK" },
  { id: "r4", name: "Walter Nguyen", age: 89, room: "B-208", wing: "Birchwood", floor: 2, x: 66, y: 44, careLevel: "Skilled Nursing", deteriorationRisk: 61, needsHelp: false, primaryConditions: ["COPD", "Fall risk"], photoInitials: "WN" },
  { id: "r5", name: "Josephine Ruiz", age: 85, room: "C-305", wing: "Cedar", floor: 2, x: 38, y: 62, careLevel: "Memory Care", deteriorationRisk: 45, needsHelp: true, helpReason: "Wandering detected near exit", primaryConditions: ["Dementia", "Anxiety"], photoInitials: "JR" },
  { id: "r6", name: "Arthur Bell", age: 79, room: "C-312", wing: "Cedar", floor: 1, x: 45, y: 74, careLevel: "Independent", deteriorationRisk: 12, needsHelp: false, primaryConditions: ["Hypertension"], photoInitials: "AB" },
  { id: "r7", name: "Margaret Osei", age: 93, room: "W-401", wing: "Willow", floor: 2, x: 80, y: 60, careLevel: "Skilled Nursing", deteriorationRisk: 82, needsHelp: false, primaryConditions: ["Post-hip-fracture", "UTI history"], photoInitials: "MO" },
  { id: "r8", name: "Samuel Ortiz", age: 88, room: "W-408", wing: "Willow", floor: 1, x: 88, y: 42, careLevel: "Assisted", deteriorationRisk: 28, needsHelp: false, primaryConditions: ["Parkinson's"], photoInitials: "SO" },
  { id: "r9", name: "Ingrid Solberg", age: 90, room: "M-118", wing: "Magnolia", floor: 3, x: 14, y: 62, careLevel: "Skilled Nursing", deteriorationRisk: 55, needsHelp: false, primaryConditions: ["CKD stage 3"], photoInitials: "IS" },
  { id: "r10", name: "Percy Adjei", age: 84, room: "B-215", wing: "Birchwood", floor: 3, x: 72, y: 66, careLevel: "Assisted", deteriorationRisk: 19, needsHelp: false, primaryConditions: ["Glaucoma"], photoInitials: "PA" },
];

export interface VitalPoint {
  t: string;
  hr: number;
  spo2: number;
  systolic: number;
  diastolic: number;
  temp: number;
  resp: number;
}

function genVitals(base: { hr: number; spo2: number; sys: number; dia: number; temp: number; resp: number }, drift: number, points = 14): VitalPoint[] {
  const out: VitalPoint[] = [];
  for (let i = 0; i < points; i++) {
    const f = i / (points - 1);
    const noise = Math.sin(i * 1.7) * 1.5;
    out.push({
      t: `Day ${i + 1}`,
      hr: Math.round(base.hr + drift * f * 0.6 + noise),
      spo2: Math.round(Math.min(100, base.spo2 - drift * f * 0.15 + noise * 0.2)),
      systolic: Math.round(base.sys + drift * f * 0.8 + noise),
      diastolic: Math.round(base.dia + drift * f * 0.3 + noise * 0.5),
      temp: +(base.temp + drift * f * 0.02 + noise * 0.03).toFixed(1),
      resp: Math.round(base.resp + drift * f * 0.25 + noise * 0.3),
    });
  }
  return out;
}

export const vitalsByResident: Record<string, VitalPoint[]> = {
  r1: genVitals({ hr: 78, spo2: 96, sys: 128, dia: 78, temp: 36.9, resp: 17 }, 16),
  r7: genVitals({ hr: 82, spo2: 94, sys: 132, dia: 80, temp: 37.1, resp: 18 }, 20),
  r4: genVitals({ hr: 88, spo2: 91, sys: 138, dia: 84, temp: 37.0, resp: 21 }, 12),
  r9: genVitals({ hr: 74, spo2: 97, sys: 122, dia: 76, temp: 36.8, resp: 16 }, 6),
  r5: genVitals({ hr: 80, spo2: 97, sys: 118, dia: 72, temp: 36.7, resp: 16 }, 2),
};

export interface DeteriorationSignal {
  residentId: string;
  label: string;
  detail: string;
  severity: "info" | "watch" | "urgent";
}

export const deteriorationSignals: DeteriorationSignal[] = [
  { residentId: "r1", label: "Rising early-warning score", detail: "NEWS2 climbed 3→6 over 48h; RR and BP trending up.", severity: "urgent" },
  { residentId: "r7", label: "SpO2 drift", detail: "Resting SpO2 down 4pts over 5 days, no reported symptoms yet.", severity: "watch" },
  { residentId: "r4", label: "Reduced oral intake", detail: "Meal completion down to 40% for 3 consecutive days.", severity: "watch" },
  { residentId: "r9", label: "Sleep fragmentation", detail: "Night wake events up from 1/night to 4/night this week.", severity: "info" },
];

export interface BehavioralEvent {
  residentId: string;
  date: string;
  pattern: string;
  note: string;
}

export const behavioralPatterns: BehavioralEvent[] = [
  { residentId: "r2", date: "Aug 18", pattern: "Sundowning agitation", note: "Increased pacing and vocalization 5–7pm, 4th day in a row." },
  { residentId: "r5", date: "Aug 19", pattern: "Exit-seeking", note: "Attempted to leave via Cedar east door twice this week." },
  { residentId: "r6", date: "Aug 17", pattern: "Social withdrawal", note: "Skipped 3 consecutive group activities, previously regular attendee." },
  { residentId: "r2", date: "Aug 20", pattern: "Sleep-wake reversal", note: "Awake and active 1–4am, drowsy through morning care." },
];

export interface ComfortEntry {
  residentId: string;
  date: string;
  painScore: number; // 0-10
  comfortScore: number; // 0-10
  method: string;
  note: string;
}

export const comfortLog: ComfortEntry[] = [
  { residentId: "r1", date: "Today 14:20", painScore: 7, comfortScore: 4, method: "Self-report", note: "Sacral pressure injury site tender on repositioning." },
  { residentId: "r1", date: "Today 09:10", painScore: 5, comfortScore: 6, method: "Self-report", note: "Improved after PRN analgesia." },
  { residentId: "r4", date: "Today 11:00", painScore: 3, comfortScore: 7, method: "PAINAD", note: "Mild grimacing on exertion, resolved at rest." },
  { residentId: "r7", date: "Yesterday 20:15", painScore: 6, comfortScore: 5, method: "PAINAD", note: "Hip discomfort, non-verbal cues — bracing, guarding." },
];

export interface IncidentRecord {
  id: string;
  type: "Fall" | "Safeguarding" | "Near Miss";
  residentId: string;
  timestamp: string;
  status: "open" | "under-review" | "closed";
  summary: string;
  severity: "low" | "moderate" | "high";
  reportedBy: string;
}

export const incidents: IncidentRecord[] = [
  { id: "i1", type: "Fall", residentId: "r4", timestamp: "Today, 06:42", status: "under-review", summary: "Found on floor beside bed, no visible injury, witnessed unsteady gait prior.", severity: "moderate", reportedBy: "Deshawn Marsh" },
  { id: "i2", type: "Near Miss", residentId: "r8", timestamp: "Today, 03:15", status: "open", summary: "Caught mid-transfer without gait belt engaged; no fall occurred.", severity: "low", reportedBy: "Grace Tan" },
  { id: "i3", type: "Safeguarding", residentId: "r5", timestamp: "Yesterday, 19:50", status: "under-review", summary: "Unexplained bruising on left forearm noted during evening care.", severity: "high", reportedBy: "Lucia Fernandez" },
  { id: "i4", type: "Fall", residentId: "r7", timestamp: "Aug 17, 22:10", status: "closed", summary: "Slipped in bathroom, minor bruise, safety huddle completed.", severity: "moderate", reportedBy: "Femi Adeyemi" },
  { id: "i5", type: "Near Miss", residentId: "r2", timestamp: "Aug 16, 15:30", status: "closed", summary: "Wandered toward stairwell, redirected before exit access.", severity: "low", reportedBy: "Amara Okafor" },
];

export interface VoiceCapture {
  id: string;
  staffName: string;
  residentId: string;
  timestamp: string;
  durationSec: number;
  transcript: string;
  outputs: {
    category: "Nursing Note" | "Care Plan Update" | "Wound Assessment" | "MAR Comment" | "Shift Handover" | "Fall Report" | "Safeguarding Flag" | "Near Miss Log";
    group: "documentation" | "safety";
    title: string;
    body: string;
    status: "drafted" | "reviewed" | "filed";
  }[];
}

export const voiceCaptures: VoiceCapture[] = [
  {
    id: "v1",
    staffName: "Amara Okafor",
    residentId: "r1",
    timestamp: "Today, 14:22",
    durationSec: 47,
    transcript:
      "Checked on Eleanor in one-oh-four, she's reporting pain seven out of ten at the sacral site, redness looks a bit worse than yesterday, about three centimeters, no drainage. Gave her the PRN paracetamol and repositioned her onto her side. Family's visiting later today so flag that for the handover. Also she barely touched breakfast again.",
    outputs: [
      { category: "Wound Assessment", group: "documentation", title: "Sacral pressure injury — Stage 2, worsening", body: "3cm diameter, increased periwound erythema vs. prior assessment, no exudate. Reposition schedule reinforced (2-hourly). Recommend wound care nurse review within 24h.", status: "drafted" },
      { category: "MAR Comment", group: "documentation", title: "PRN paracetamol administered", body: "1g PO given for reported pain 7/10 at sacral wound site. Reassess in 60 minutes.", status: "drafted" },
      { category: "Nursing Note", group: "documentation", title: "14:22 — Pain & nutrition check", body: "Resident alert, reports 7/10 sacral pain. Reduced appetite, breakfast <25% consumed for 3rd consecutive day — dietitian referral suggested.", status: "drafted" },
      { category: "Shift Handover", group: "documentation", title: "Handover flag — family visit + wound watch", body: "Family expected this afternoon. Wound site trending worse — please reassess before next shift and continue 2-hourly repositioning.", status: "drafted" },
    ],
  },
  {
    id: "v2",
    staffName: "Deshawn Marsh",
    residentId: "r4",
    timestamp: "Today, 06:44",
    durationSec: 63,
    transcript:
      "Walter was found on the floor next to his bed around six forty when I did rounds. He was awake, talking, said he was trying to get to the bathroom on his own. No obvious injuries, no bump on the head, vitals stable. His gait's been unsteady the last couple of days honestly, I noticed it yesterday too. Helped him back to bed, notified the nurse, going to keep an eye on him this shift.",
    outputs: [
      { category: "Fall Report", group: "safety", title: "Unwitnessed fall — found on floor, no injury noted", body: "Resident found on floor adjacent to bed ~06:40, alert and oriented, attempting self-transfer to bathroom. No visible injury, vitals within baseline. Unsteady gait observed x2 days prior — pattern noted, not previously escalated.", status: "drafted" },
      { category: "Nursing Note", group: "documentation", title: "06:44 — Post-fall check", body: "Full body check completed, no bruising or swelling. Neuro checks initiated per protocol. Resident returned to bed, call bell within reach.", status: "drafted" },
      { category: "Care Plan Update", group: "documentation", title: "Gait instability — increase fall precautions", body: "Recommend reassessment for mobility aid, bed alarm activation, and physio review given 2-day pattern of unsteady gait preceding fall.", status: "drafted" },
    ],
  },
  {
    id: "v3",
    staffName: "Lucia Fernandez",
    residentId: "r5",
    timestamp: "Yesterday, 19:52",
    durationSec: 38,
    transcript:
      "Doing evening care for Josephine, noticed bruising on her left forearm, kind of yellow-purple so it's not brand new, maybe a few days old. She couldn't really tell me how it happened. Nothing in the notes about a fall or bump. Flagging this one, want it looked at properly.",
    outputs: [
      { category: "Safeguarding Flag", group: "safety", title: "Unexplained bruising — origin unknown", body: "Yellow-purple bruising, left forearm, estimated 3-5 days old. No documented incident or injury on file. Resident unable to account for cause. Escalated for safeguarding lead review per policy.", status: "drafted" },
      { category: "Nursing Note", group: "documentation", title: "19:52 — Skin check finding", body: "Bruising noted left forearm during evening ADLs, approx 4cm, non-tender on palpation. Photographed for record, safeguarding notified.", status: "drafted" },
    ],
  },
];

export interface InventoryItem {
  id: string;
  name: string;
  category: "PPE" | "Wound Care" | "Continence" | "Medication Supplies" | "Nutrition" | "Linen";
  onHand: number;
  parLevel: number;
  unit: string;
  daysOfSupply: number;
  status: "ok" | "low" | "critical";
}

export const inventory: InventoryItem[] = [
  { id: "inv1", name: "Nitrile gloves (M)", category: "PPE", onHand: 1400, parLevel: 2000, unit: "pcs", daysOfSupply: 6, status: "low" },
  { id: "inv2", name: "Foam dressings 10x10cm", category: "Wound Care", onHand: 38, parLevel: 120, unit: "pcs", daysOfSupply: 3, status: "critical" },
  { id: "inv3", name: "Incontinence briefs (L)", category: "Continence", onHand: 640, parLevel: 700, unit: "pcs", daysOfSupply: 9, status: "ok" },
  { id: "inv4", name: "Insulin syringes 1mL", category: "Medication Supplies", onHand: 210, parLevel: 250, unit: "pcs", daysOfSupply: 11, status: "ok" },
  { id: "inv5", name: "Thickened fluid sachets", category: "Nutrition", onHand: 52, parLevel: 200, unit: "pcs", daysOfSupply: 2, status: "critical" },
  { id: "inv6", name: "Fitted bed sheets", category: "Linen", onHand: 180, parLevel: 220, unit: "pcs", daysOfSupply: 14, status: "ok" },
  { id: "inv7", name: "Surgical masks", category: "PPE", onHand: 900, parLevel: 1500, unit: "pcs", daysOfSupply: 5, status: "low" },
];

export interface RoomInfo {
  id: string;
  label: string;
  wing: Wing;
  floor: Floor;
  occupant: string | null;
  status: "occupied" | "vacant-ready" | "vacant-turnover" | "maintenance";
  bedType: "Single" | "Shared";
}

export const rooms: RoomInfo[] = [
  { id: "rm1", label: "M-104", wing: "Magnolia", floor: 1, occupant: "Eleanor Whitfield", status: "occupied", bedType: "Single" },
  { id: "rm2", label: "M-106", wing: "Magnolia", floor: 1, occupant: null, status: "vacant-turnover", bedType: "Single" },
  { id: "rm3", label: "M-112", wing: "Magnolia", floor: 2, occupant: "Harold Jensen", status: "occupied", bedType: "Single" },
  { id: "rm4", label: "M-118", wing: "Magnolia", floor: 3, occupant: "Ingrid Solberg", status: "occupied", bedType: "Single" },
  { id: "rm5", label: "B-201", wing: "Birchwood", floor: 1, occupant: "Beatrice Kim", status: "occupied", bedType: "Shared" },
  { id: "rm6", label: "B-208", wing: "Birchwood", floor: 2, occupant: "Walter Nguyen", status: "occupied", bedType: "Single" },
  { id: "rm7", label: "B-215", wing: "Birchwood", floor: 3, occupant: "Percy Adjei", status: "occupied", bedType: "Single" },
  { id: "rm8", label: "B-220", wing: "Birchwood", floor: 1, occupant: null, status: "maintenance", bedType: "Single" },
  { id: "rm9", label: "C-305", wing: "Cedar", floor: 2, occupant: "Josephine Ruiz", status: "occupied", bedType: "Single" },
  { id: "rm10", label: "C-312", wing: "Cedar", floor: 1, occupant: "Arthur Bell", status: "occupied", bedType: "Single" },
  { id: "rm11", label: "C-318", wing: "Cedar", floor: 3, occupant: null, status: "vacant-ready", bedType: "Shared" },
  { id: "rm12", label: "W-401", wing: "Willow", floor: 2, occupant: "Margaret Osei", status: "occupied", bedType: "Single" },
  { id: "rm13", label: "W-408", wing: "Willow", floor: 1, occupant: "Samuel Ortiz", status: "occupied", bedType: "Single" },
  { id: "rm14", label: "W-412", wing: "Willow", floor: 3, occupant: null, status: "vacant-ready", bedType: "Single" },
];

export interface MaintenanceTicket {
  id: string;
  title: string;
  location: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in-progress" | "scheduled" | "done";
  raisedBy: string;
  age: string;
}

export const maintenanceTickets: MaintenanceTicket[] = [
  { id: "mt1", title: "Ceiling hoist inspection overdue", location: "B-208", priority: "high", status: "scheduled", raisedBy: "System", age: "2 days" },
  { id: "mt2", title: "Bathroom grab rail loose", location: "C-312", priority: "high", status: "open", raisedBy: "Arthur Bell (family)", age: "6 hrs" },
  { id: "mt3", title: "HVAC noise complaint", location: "Willow lounge", priority: "medium", status: "in-progress", raisedBy: "Grace Tan", age: "1 day" },
  { id: "mt4", title: "Bed motor slow to recline", location: "M-118", priority: "low", status: "open", raisedBy: "Amara Okafor", age: "3 days" },
  { id: "mt5", title: "Nurse call button unresponsive", location: "B-220", priority: "high", status: "in-progress", raisedBy: "System", age: "18 hrs" },
];

export interface AuditItem {
  id: string;
  domain: string;
  requirement: string;
  status: "met" | "at-risk" | "gap";
  lastEvidence: string;
  owner: string;
}

export const auditItems: AuditItem[] = [
  { id: "a1", domain: "Medication Management", requirement: "Controlled substance count reconciliation, daily", status: "met", lastEvidence: "Auto-verified from MAR log, today 08:00", owner: "Pharmacy lead" },
  { id: "a2", domain: "Infection Control", requirement: "Hand hygiene audit ≥ 90% compliance", status: "at-risk", lastEvidence: "84% compliance, last 7-day rolling window", owner: "IPC lead" },
  { id: "a3", domain: "Falls Prevention", requirement: "Post-fall huddle within 24h of incident", status: "gap", lastEvidence: "1 of 2 falls this week missing huddle record", owner: "DON" },
  { id: "a4", domain: "Safeguarding", requirement: "All flags escalated to lead within 4h", status: "met", lastEvidence: "Avg escalation time 38 min, last 30 days", owner: "Safeguarding lead" },
  { id: "a5", domain: "Care Planning", requirement: "Care plans reviewed every 90 days", status: "at-risk", lastEvidence: "6 residents overdue for review (3-11 days)", owner: "Care coordinators" },
  { id: "a6", domain: "Nutrition & Hydration", requirement: "Weight checks monthly, all residents", status: "met", lastEvidence: "100% completed, this cycle", owner: "Dietitian" },
  { id: "a7", domain: "Staffing", requirement: "Minimum RN coverage per shift maintained", status: "at-risk", lastEvidence: "2 shifts below target in last 14 days", owner: "Scheduling" },
];

export interface FamilyThread {
  id: string;
  residentId: string;
  familyMember: string;
  lastMessage: string;
  timestamp: string;
  status: "awaiting-reply" | "draft-ready" | "sent";
  channel: "SMS" | "App" | "Email";
}

export const familyThreads: FamilyThread[] = [
  { id: "f1", residentId: "r1", familyMember: "Rachel Whitfield (daughter)", lastMessage: "Is mom's wound getting checked today? She mentioned it hurt a lot last night.", timestamp: "26 min ago", status: "draft-ready", channel: "App" },
  { id: "f2", residentId: "r7", familyMember: "David Osei (son)", lastMessage: "Weekly update requested", timestamp: "1 hr ago", status: "draft-ready", channel: "Email" },
  { id: "f3", residentId: "r4", familyMember: "Linh Nguyen (wife)", lastMessage: "Thank you for letting us know so quickly about the fall.", timestamp: "3 hr ago", status: "sent", channel: "SMS" },
  { id: "f4", residentId: "r2", familyMember: "Carol Jensen (daughter)", lastMessage: "Can someone call me about dad's medication change?", timestamp: "5 hr ago", status: "awaiting-reply", channel: "App" },
  { id: "f5", residentId: "r5", familyMember: "Marco Ruiz (son)", lastMessage: "Weekly update requested", timestamp: "Yesterday", status: "draft-ready", channel: "Email" },
];

export const familyDrafts: Record<string, string> = {
  f1: "Hi Rachel — thank you for reaching out. Yes, our wound care nurse reviewed your mom's sacral site this afternoon. We've noted increased redness and she reported 7/10 pain, so we've given PRN pain relief, adjusted her repositioning schedule, and scheduled a follow-up assessment tomorrow morning. We'll call you directly if anything changes before then. You're welcome to visit this afternoon as planned.",
  f2: "Hello David — here's Margaret's weekly update. Overall she's been in good spirits and enjoyed Tuesday's music session. We are monitoring a gradual change in her oxygen levels that hasn't caused any symptoms, and the care team has increased observation frequency as a precaution. Her appetite and mobility remain stable. Happy to discuss further on a call this week if helpful.",
  f5: "Hi Marco — quick update on Josephine this week. She's been more active in the mornings and enjoyed gardening group twice. We did note a couple of instances of her walking toward the east exit, which our team responded to promptly — we've adjusted supervision during that time window as a precaution. No safety concerns at this time. Let us know if you'd like to discuss.",
};

export interface RiskEntry {
  residentId: string;
  hospitalizationRisk: number; // 0-100
  readmissionRisk: number; // 0-100
  primaryDrivers: string[];
  trend: "up" | "down" | "flat";
}

export const riskEntries: RiskEntry[] = [
  { residentId: "r1", hospitalizationRisk: 71, readmissionRisk: 58, primaryDrivers: ["Worsening pressure injury", "Declining nutrition intake", "Elevated pain scores"], trend: "up" },
  { residentId: "r7", hospitalizationRisk: 66, readmissionRisk: 74, primaryDrivers: ["Post-fracture recovery", "SpO2 drift", "UTI recurrence history"], trend: "up" },
  { residentId: "r4", hospitalizationRisk: 54, readmissionRisk: 41, primaryDrivers: ["Recent fall", "COPD exacerbation risk", "Reduced oral intake"], trend: "up" },
  { residentId: "r9", hospitalizationRisk: 38, readmissionRisk: 29, primaryDrivers: ["CKD stage 3 monitoring", "Sleep fragmentation"], trend: "flat" },
  { residentId: "r5", hospitalizationRisk: 22, readmissionRisk: 18, primaryDrivers: ["Wandering risk", "Anxiety episodes"], trend: "down" },
];

export interface CarePlanEffectiveness {
  residentId: string;
  planFocus: string;
  effectivenessScore: number; // 0-100
  trend: "improving" | "stable" | "declining";
  note: string;
}

export const carePlanEffectiveness: CarePlanEffectiveness[] = [
  { residentId: "r2", planFocus: "Dementia behavioral management", effectivenessScore: 62, trend: "declining", note: "Sundowning frequency increased despite current intervention plan." },
  { residentId: "r8", planFocus: "Parkinson's mobility support", effectivenessScore: 81, trend: "improving", note: "Physio-adjusted gait plan reducing freezing episodes." },
  { residentId: "r1", planFocus: "Pressure injury prevention", effectivenessScore: 44, trend: "declining", note: "Repositioning adherence gaps correlating with wound progression." },
  { residentId: "r6", planFocus: "Independent living activation", effectivenessScore: 76, trend: "stable", note: "Consistent engagement, no change needed." },
];

export interface StaffDemandPoint {
  day: string;
  predictedNeed: number;
  scheduled: number;
}

export const staffDemandForecast: StaffDemandPoint[] = [
  { day: "Mon", predictedNeed: 18, scheduled: 17 },
  { day: "Tue", predictedNeed: 19, scheduled: 18 },
  { day: "Wed", predictedNeed: 22, scheduled: 18 },
  { day: "Thu", predictedNeed: 21, scheduled: 19 },
  { day: "Fri", predictedNeed: 20, scheduled: 20 },
  { day: "Sat", predictedNeed: 16, scheduled: 16 },
  { day: "Sun", predictedNeed: 17, scheduled: 15 },
];

export function residentById(id: string): Resident | undefined {
  return residents.find((r) => r.id === id);
}
export function staffById(id: string): StaffMember | undefined {
  return staff.find((s) => s.id === id);
}
