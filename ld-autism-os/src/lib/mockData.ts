// Mock data for the Lumen prototype. Deterministic, hand-authored — no backend.
// Language follows person-centred, strengths-based conventions used across UK
// learning disability & autism services (CQC, PBS Academy, STOMP).

export type ServiceType = "Supported Living" | "Residential" | "Day Service" | "Outreach";
export type Home = "Willow House" | "Cedar Court" | "Birchwood Lodge" | "Magnolia Hub";

export interface CommunicationPassport {
  likes: string[];
  dislikes: string[];
  triggers: string[];
  calmingStrategies: string[];
}

export interface Individual {
  id: string;
  name: string;
  age: number;
  service: ServiceType;
  home: Home;
  keyworker: string;
  diagnoses: string[];
  communicationProfile: string[];
  supportRatio: "1:1" | "2:1" | "1:2" | "1:4";
  dolsStatus: "authorised" | "pending" | "expiring-soon" | "none";
  escalationRisk: number; // 0-100, behavioural escalation risk
  placementStabilityRisk: number; // 0-100
  photoInitials: string;
  passport: CommunicationPassport;
}

export const individuals: Individual[] = [
  {
    id: "p1",
    name: "Jamie Whitcombe",
    age: 24,
    service: "Supported Living",
    home: "Willow House",
    keyworker: "Deshawn Marsh",
    diagnoses: ["Autism spectrum condition", "Mild learning disability"],
    communicationProfile: ["Verbal — short, direct sentences", "Visual schedules", "Struggles with open-ended questions"],
    supportRatio: "1:1",
    dolsStatus: "authorised",
    escalationRisk: 72,
    placementStabilityRisk: 38,
    photoInitials: "JW",
    passport: {
      likes: ["Trains and timetables", "Predictable routine", "His own room being tidy"],
      dislikes: ["Sudden plan changes", "Loud unexpected noise", "Being touched without warning"],
      triggers: ["Change of support worker at short notice", "Overcrowded spaces", "Being rushed"],
      calmingStrategies: ["Offer a visual timer", "Move to a quiet space", "Talk about train routes"],
    },
  },
  {
    id: "p2",
    name: "Priya Chandran",
    age: 31,
    service: "Residential",
    home: "Cedar Court",
    keyworker: "Amara Okafor",
    diagnoses: ["Down syndrome", "Hypothyroidism"],
    communicationProfile: ["Makaton signing", "Verbal — single words and phrases", "Responds well to visual choice boards"],
    supportRatio: "1:2",
    dolsStatus: "authorised",
    escalationRisk: 22,
    placementStabilityRisk: 14,
    photoInitials: "PC",
    passport: {
      likes: ["Music and singing", "Baking group", "Her keyworker Amara"],
      dislikes: ["Cold food", "Being left out of group activities"],
      triggers: ["Feeling unwell and unable to explain it", "Fatigue late in the day"],
      calmingStrategies: ["Put on familiar music", "Offer a warm drink", "Sit with her one-to-one"],
    },
  },
  {
    id: "p3",
    name: "Noah Fitzgerald",
    age: 19,
    service: "Day Service",
    home: "Magnolia Hub",
    keyworker: "Grace Tan",
    diagnoses: ["Autism spectrum condition (non-verbal)", "Epilepsy"],
    communicationProfile: ["AAC device (Proloquo2Go)", "PECS as backup", "Non-verbal — relies on gesture and behaviour cues"],
    supportRatio: "1:1",
    dolsStatus: "authorised",
    escalationRisk: 58,
    placementStabilityRisk: 27,
    photoInitials: "NF",
    passport: {
      likes: ["Water play", "Weighted blanket", "Rhythmic music"],
      dislikes: ["Hand dryers", "Strong smells", "Fluorescent lighting"],
      triggers: ["Missed seizure medication window", "Sensory overload in busy rooms"],
      calmingStrategies: ["Reduce lighting", "Offer weighted blanket", "Use AAC device to check for pain/discomfort"],
    },
  },
  {
    id: "p4",
    name: "Aisha Rahman",
    age: 27,
    service: "Residential",
    home: "Birchwood Lodge",
    keyworker: "Lucia Fernandez",
    diagnoses: ["Autism spectrum condition", "Generalised anxiety disorder"],
    communicationProfile: ["Verbal — fluent, prefers written information too", "Needs processing time before answering"],
    supportRatio: "1:2",
    dolsStatus: "expiring-soon",
    escalationRisk: 44,
    placementStabilityRisk: 51,
    photoInitials: "AR",
    passport: {
      likes: ["Drawing", "Her cat plush toy", "One-to-one time with keyworker"],
      dislikes: ["Being asked to make quick decisions", "Groups larger than 3 people"],
      triggers: ["Unfamiliar visitors without notice", "Upcoming appointments not explained in advance"],
      calmingStrategies: ["Give written notice of changes", "Offer drawing materials", "Allow extra processing time"],
    },
  },
  {
    id: "p5",
    name: "Callum Wren",
    age: 22,
    service: "Supported Living",
    home: "Willow House",
    keyworker: "Marisol Ibarra",
    diagnoses: ["Mild learning disability", "ADHD"],
    communicationProfile: ["Verbal — fluent", "Responds well to short, structured tasks"],
    supportRatio: "1:4",
    dolsStatus: "none",
    escalationRisk: 31,
    placementStabilityRisk: 19,
    photoInitials: "CW",
    passport: {
      likes: ["Football", "Video games", "Being given responsibility"],
      dislikes: ["Sitting still for long periods", "Being told off in front of others"],
      triggers: ["Boredom / unstructured time", "Perceived unfairness"],
      calmingStrategies: ["Offer physical activity", "Give a specific task", "Speak to him privately"],
    },
  },
  {
    id: "p6",
    name: "Freya Lindqvist",
    age: 35,
    service: "Residential",
    home: "Cedar Court",
    keyworker: "Tobias Kraus",
    diagnoses: ["Autism spectrum condition", "Epilepsy", "Profound and multiple learning disability"],
    communicationProfile: ["Non-verbal", "Communicates via facial expression, vocalisation and body language"],
    supportRatio: "2:1",
    dolsStatus: "authorised",
    escalationRisk: 36,
    placementStabilityRisk: 22,
    photoInitials: "FL",
    passport: {
      likes: ["Hand massage", "Soft textured fabrics", "Being sung to"],
      dislikes: ["Being moved quickly", "Bright light"],
      triggers: ["Pre-seizure aura discomfort", "Constipation / unspoken physical discomfort"],
      calmingStrategies: ["Slow, narrated movements", "Dim lighting", "Familiar caregiver voice"],
    },
  },
  {
    id: "p7",
    name: "Tyrone Osei",
    age: 29,
    service: "Outreach",
    home: "Magnolia Hub",
    keyworker: "Femi Adeyemi",
    diagnoses: ["Moderate learning disability"],
    communicationProfile: ["Verbal — fluent with familiar people", "Quieter with strangers"],
    supportRatio: "1:4",
    dolsStatus: "none",
    escalationRisk: 18,
    placementStabilityRisk: 11,
    photoInitials: "TO",
    passport: {
      likes: ["His part-time warehouse job", "Cooking his own meals", "Independence"],
      dislikes: ["Being micromanaged", "Public transport delays"],
      triggers: ["Feeling patronised", "Financial worries"],
      calmingStrategies: ["Talk it through calmly", "Offer a budgeting checklist"],
    },
  },
  {
    id: "p8",
    name: "Maisie Doyle",
    age: 20,
    service: "Day Service",
    home: "Magnolia Hub",
    keyworker: "Priya Nair",
    diagnoses: ["Autism spectrum condition", "Sensory processing disorder"],
    communicationProfile: ["Verbal — echolalic, scripting from favourite shows", "Visual supports for transitions"],
    supportRatio: "1:2",
    dolsStatus: "none",
    escalationRisk: 41,
    placementStabilityRisk: 24,
    photoInitials: "MD",
    passport: {
      likes: ["Animated films", "Repeating favourite phrases", "Fidget toys"],
      dislikes: ["Unannounced transitions between rooms", "Wet hands/sticky textures"],
      triggers: ["Activity ending without warning", "Being asked to touch messy play materials"],
      calmingStrategies: ["5-minute visual countdown before transitions", "Offer fidget toy", "Let her script a favourite scene"],
    },
  },
];

export interface TherapyPlan {
  id: string;
  individualId: string;
  discipline: "Speech & Language Therapy" | "Occupational Therapy" | "Positive Behaviour Support" | "Physiotherapy" | "Psychology";
  goal: string;
  sessionsPlanned: number;
  sessionsAttended: number;
  adherence: number; // 0-100
  trend: "improving" | "stable" | "declining";
  lastSession: string;
  nextSession: string;
}

export const therapyPlans: TherapyPlan[] = [
  { id: "t1", individualId: "p1", discipline: "Positive Behaviour Support", goal: "Reduce shutdown episodes triggered by unplanned changes, via advance-warning strategy", sessionsPlanned: 4, sessionsAttended: 4, adherence: 100, trend: "stable", lastSession: "Aug 14", nextSession: "Sep 11" },
  { id: "t2", individualId: "p1", discipline: "Occupational Therapy", goal: "Build tolerance to unexpected sensory input in community settings", sessionsPlanned: 4, sessionsAttended: 2, adherence: 50, trend: "declining", lastSession: "Jul 30", nextSession: "Overdue" },
  { id: "t3", individualId: "p3", discipline: "Speech & Language Therapy", goal: "Expand AAC vocabulary for expressing pain and discomfort", sessionsPlanned: 6, sessionsAttended: 6, adherence: 100, trend: "improving", lastSession: "Aug 19", nextSession: "Sep 2" },
  { id: "t4", individualId: "p3", discipline: "Positive Behaviour Support", goal: "Function-based plan for self-injurious behaviour around mealtimes", sessionsPlanned: 4, sessionsAttended: 3, adherence: 75, trend: "improving", lastSession: "Aug 10", nextSession: "Sep 7" },
  { id: "t5", individualId: "p4", discipline: "Psychology", goal: "CBT-informed anxiety management ahead of planned placement review", sessionsPlanned: 6, sessionsAttended: 4, adherence: 67, trend: "stable", lastSession: "Aug 15", nextSession: "Aug 29" },
  { id: "t6", individualId: "p4", discipline: "Occupational Therapy", goal: "Sensory diet to support regulation before appointments", sessionsPlanned: 3, sessionsAttended: 1, adherence: 33, trend: "declining", lastSession: "Jul 18", nextSession: "Overdue" },
  { id: "t7", individualId: "p6", discipline: "Physiotherapy", goal: "Postural support and passive movement programme", sessionsPlanned: 8, sessionsAttended: 8, adherence: 100, trend: "stable", lastSession: "Aug 20", nextSession: "Aug 27" },
  { id: "t8", individualId: "p8", discipline: "Occupational Therapy", goal: "Graded exposure to textured/messy play materials", sessionsPlanned: 4, sessionsAttended: 3, adherence: 75, trend: "improving", lastSession: "Aug 12", nextSession: "Sep 9" },
  { id: "t9", individualId: "p2", discipline: "Speech & Language Therapy", goal: "Maintain Makaton vocabulary, introduce 5 new signs this quarter", sessionsPlanned: 4, sessionsAttended: 4, adherence: 100, trend: "stable", lastSession: "Aug 6", nextSession: "Sep 3" },
];

export interface SensoryProfileEntry {
  individualId: string;
  domain: "Auditory" | "Visual" | "Tactile" | "Vestibular" | "Proprioceptive" | "Oral";
  pattern: "seeks" | "avoids" | "neutral";
  note: string;
}

export const sensoryProfiles: SensoryProfileEntry[] = [
  { individualId: "p1", domain: "Auditory", pattern: "avoids", note: "Sudden loud noise (alarms, shouting) can trigger shutdown within seconds." },
  { individualId: "p1", domain: "Tactile", pattern: "avoids", note: "Prefers verbal warning before any physical contact, including light touch on the arm." },
  { individualId: "p3", domain: "Visual", pattern: "avoids", note: "Fluorescent flicker linked to increased motor stimming and agitation." },
  { individualId: "p3", domain: "Proprioceptive", pattern: "seeks", note: "Weighted blanket and deep pressure reliably reduce distress within minutes." },
  { individualId: "p4", domain: "Auditory", pattern: "avoids", note: "Multiple overlapping conversations increase anxiety markedly." },
  { individualId: "p6", domain: "Tactile", pattern: "seeks", note: "Soft fabric and hand massage produce visible relaxation response." },
  { individualId: "p6", domain: "Visual", pattern: "avoids", note: "Bright light correlates with increased pre-seizure agitation." },
  { individualId: "p8", domain: "Tactile", pattern: "avoids", note: "Wet or sticky textures on hands cause immediate distress vocalisation." },
  { individualId: "p8", domain: "Oral", pattern: "seeks", note: "Chew-safe fidget helps regulate during transitions." },
];

export interface CircleOfSupportContact {
  individualId: string;
  name: string;
  relation: string;
  contactFrequency: string;
}

export const circleOfSupport: CircleOfSupportContact[] = [
  { individualId: "p1", name: "Deshawn Marsh", relation: "Keyworker", contactFrequency: "Daily" },
  { individualId: "p1", name: "Sandra Whitcombe", relation: "Mother", contactFrequency: "Weekly call" },
  { individualId: "p1", name: "Dr. Osei", relation: "GP", contactFrequency: "As needed" },
  { individualId: "p1", name: "Fiona Yang", relation: "Social worker", contactFrequency: "Monthly review" },
  { individualId: "p3", name: "Grace Tan", relation: "Keyworker", contactFrequency: "Daily" },
  { individualId: "p3", name: "Michael Fitzgerald", relation: "Father", contactFrequency: "Twice weekly visit" },
  { individualId: "p3", name: "Dr. Bello (Neurology)", relation: "Consultant", contactFrequency: "Quarterly" },
  { individualId: "p4", name: "Lucia Fernandez", relation: "Keyworker", contactFrequency: "Daily" },
  { individualId: "p4", name: "Naima Rahman", relation: "Sister", contactFrequency: "Weekly video call" },
  { individualId: "p4", name: "Dr. Whitfield", relation: "Psychiatrist", contactFrequency: "6-weekly" },
];

export interface JourneyEvent {
  individualId: string;
  date: string;
  label: string;
  detail: string;
  type: "placement" | "diagnosis" | "therapy" | "review" | "transition";
}

export const journeyEvents: JourneyEvent[] = [
  { individualId: "p1", date: "2019", label: "Diagnosed with ASC", detail: "Diagnosed at 17 following CAMHS referral from college.", type: "diagnosis" },
  { individualId: "p1", date: "2021", label: "Transitioned from family home", detail: "Moved into Willow House supported living, 1:1 support agreed.", type: "transition" },
  { individualId: "p1", date: "2023", label: "PBS plan introduced", detail: "Function-based plan for shutdown episodes following incident cluster.", type: "therapy" },
  { individualId: "p1", date: "Aug 2026", label: "Care & support plan review", detail: "Annual review due — escalation risk trending up, bring to panel.", type: "review" },
  { individualId: "p3", date: "2015", label: "Diagnosed with ASC & epilepsy", detail: "Dual diagnosis identified in early childhood.", type: "diagnosis" },
  { individualId: "p3", date: "2022", label: "AAC device introduced", detail: "Proloquo2Go trialled and adopted after PECS plateaued.", type: "therapy" },
  { individualId: "p3", date: "2024", label: "Moved to day service", detail: "Stepped down from residential to family home + day service model.", type: "transition" },
  { individualId: "p4", date: "2020", label: "Diagnosed with ASC & GAD", detail: "Diagnosed following mental health crisis admission.", type: "diagnosis" },
  { individualId: "p4", date: "2022", label: "Moved to Birchwood Lodge", detail: "Transitioned from residential college placement.", type: "placement" },
  { individualId: "p4", date: "Sep 2026", label: "DoLS renewal due", detail: "Liberty Protection Safeguards authorisation expires in 12 days.", type: "review" },
];

export interface IncidentRecord {
  id: string;
  type: "Behavioural Escalation" | "Restrictive Practice" | "Safeguarding" | "Near Miss";
  individualId: string;
  timestamp: string;
  status: "open" | "under-review" | "closed";
  summary: string;
  severity: "low" | "moderate" | "high";
  reportedBy: string;
  restrictivePracticeUsed?: string;
}

export const incidents: IncidentRecord[] = [
  { id: "i1", type: "Restrictive Practice", individualId: "p1", timestamp: "Today, 15:40", status: "under-review", summary: "Brief physical guide (2-person escort) used after attempt to leave the building during dysregulation.", severity: "moderate", reportedBy: "Deshawn Marsh", restrictivePracticeUsed: "2-person physical escort, 40 seconds" },
  { id: "i2", type: "Behavioural Escalation", individualId: "p3", timestamp: "Today, 11:05", status: "open", summary: "Self-injurious behaviour (head contact) during lunch transition, resolved with weighted blanket and reduced lighting.", severity: "moderate", reportedBy: "Grace Tan" },
  { id: "i3", type: "Safeguarding", individualId: "p4", timestamp: "Yesterday, 19:20", status: "under-review", summary: "Unexplained bruising to left wrist noted during evening support, origin unclear.", severity: "high", reportedBy: "Lucia Fernandez" },
  { id: "i4", type: "Near Miss", individualId: "p8", timestamp: "Aug 18, 14:10", status: "closed", summary: "Attempted to leave activity room unsupervised during fire alarm test; redirected before exit.", severity: "low", reportedBy: "Priya Nair" },
  { id: "i5", type: "Behavioural Escalation", individualId: "p1", timestamp: "Aug 16, 09:30", status: "closed", summary: "Shutdown following last-minute transport change; de-escalated with visual timer, no restrictive practice used.", severity: "low", reportedBy: "Deshawn Marsh" },
];

export interface VoiceCapture {
  id: string;
  staffName: string;
  individualId: string;
  timestamp: string;
  durationSec: number;
  transcript: string;
  outputs: {
    category: "ABC Chart" | "Sensory Log" | "Daily Living Note" | "PBS Plan Update" | "Restrictive Practice Log" | "Shift Handover" | "Safeguarding Flag" | "Incident Report";
    group: "documentation" | "safety";
    title: string;
    body: string;
    status: "drafted" | "reviewed" | "filed";
  }[];
}

export const voiceCaptures: VoiceCapture[] = [
  {
    id: "v1",
    staffName: "Deshawn Marsh",
    individualId: "p1",
    timestamp: "Today, 15:41",
    durationSec: 52,
    transcript:
      "Just got back from the supermarket trip with Jamie. It went wrong pretty fast — the click and collect queue was way longer than we planned for, no warning, and he started asking to leave repeatedly, got louder, then tried to walk out the fire exit near the tills. I used a two-person guide with Priya to keep him safe, maybe forty seconds, then we got him to the car and he calmed down once we put his train podcast on. No injuries to him or us. This is the third time this month a queue's set him off.",
    outputs: [
      { category: "ABC Chart", group: "documentation", title: "Antecedent: unplanned queue delay at supermarket", body: "Antecedent: unexpected 15+ minute queue, deviation from planned routine. Behaviour: repeated exit requests escalating to attempt to leave via fire exit. Consequence: 2-person physical guide (~40s), redirected to vehicle, calmed via preferred audio (train podcast). 3rd similar pattern this month — recommend PBS review of queuing/waiting tolerance.", status: "drafted" },
      { category: "Restrictive Practice Log", group: "safety", title: "2-person physical guide — 40 seconds", body: "Least restrictive option used after verbal de-escalation unsuccessful. No injury to individual or staff. Consistent with authorised PBS plan. Reportable per restrictive practice reduction policy.", status: "drafted" },
      { category: "PBS Plan Update", group: "documentation", title: "Recommend: pre-emptive queue-time strategy", body: "Third queue-related escalation in 30 days. Suggest adding visual countdown card and pre-booked slot strategy to PBS plan before next community outing.", status: "drafted" },
      { category: "Shift Handover", group: "documentation", title: "Handover flag — community access review needed", body: "Jamie de-escalated fully, no lasting distress observed. Flagging pattern of queue-related triggers for PBS lead review before next scheduled outing.", status: "drafted" },
    ],
  },
  {
    id: "v2",
    staffName: "Grace Tan",
    individualId: "p3",
    timestamp: "Today, 11:06",
    durationSec: 41,
    transcript:
      "Noah had a rough moment during the lunch transition, started hitting the side of his head with his hand, maybe five or six times before I got to him. Room was pretty loud, someone had the radio on and the strip lights were flickering a bit near the serving hatch. Used his weighted blanket and dimmed the lights, he settled within about two minutes. He hasn't eaten much today either, only about a third of breakfast, want that flagged too.",
    outputs: [
      { category: "ABC Chart", group: "documentation", title: "Self-injurious behaviour during lunch transition", body: "Antecedent: loud/flickering sensory environment during transition, reduced food intake this morning. Behaviour: head-hitting, 5-6 instances. Consequence: weighted blanket + reduced lighting, settled within 2 minutes. Consider whether reduced intake reflects discomfort not yet expressed via AAC.", status: "drafted" },
      { category: "Sensory Log", group: "documentation", title: "Flickering strip light + noise — serving hatch area", body: "Environmental trigger noted at serving hatch: fluorescent flicker and ambient noise coincide with 2nd self-injury episode in this location this week. Facilities flagged for lighting check.", status: "drafted" },
      { category: "Daily Living Note", group: "documentation", title: "Reduced breakfast intake — ~30%", body: "Only partial breakfast consumed. No verbal complaint via AAC. Given history of diagnostic overshadowing, recommend monitoring for underlying discomfort rather than attributing solely to behaviour.", status: "drafted" },
    ],
  },
  {
    id: "v3",
    staffName: "Lucia Fernandez",
    individualId: "p4",
    timestamp: "Yesterday, 19:22",
    durationSec: 35,
    transcript:
      "Doing evening support with Aisha, noticed bruising on her left wrist, yellowish so a few days old at least. She got quite anxious when I asked about it and said she didn't want to talk about it. Nothing logged anywhere about a fall or bump this week. I want this looked at properly, flagging it now.",
    outputs: [
      { category: "Safeguarding Flag", group: "safety", title: "Unexplained bruising — origin unknown, individual declined to discuss", body: "Yellow bruising to left wrist, estimated several days old. No recorded incident. Individual became anxious when asked and declined to explain — noted as potentially significant given her communication profile. Escalated to safeguarding lead for review per policy.", status: "drafted" },
      { category: "Daily Living Note", group: "documentation", title: "19:22 — Skin check finding", body: "Bruising noted left wrist during evening support, approx 3cm, non-tender on light palpation. Photographed for record with consent process followed, safeguarding lead notified.", status: "drafted" },
    ],
  },
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
  { id: "a1", domain: "Restrictive Practice", requirement: "Restrictive Practice Reduction Plan reviewed monthly, all individuals with plans", status: "at-risk", lastEvidence: "1 of 4 active plans overdue for review by 6 days", owner: "PBS lead" },
  { id: "a2", domain: "Medication (STOMP)", requirement: "Psychotropic medication reviewed at least every 6 months", status: "met", lastEvidence: "All current prescriptions reviewed within window, last check today", owner: "Pharmacy lead" },
  { id: "a3", domain: "Mental Capacity & DoLS", requirement: "DoLS / Liberty Protection Safeguards authorisation current for all subject individuals", status: "at-risk", lastEvidence: "Aisha Rahman's authorisation expires in 12 days, renewal submitted", owner: "Registered manager" },
  { id: "a4", domain: "Workforce Training", requirement: "Oliver McGowan Mandatory Training (Tier 2) completed by all direct care staff", status: "at-risk", lastEvidence: "91% completion, 4 staff overdue", owner: "Learning & development" },
  { id: "a5", domain: "Positive Behaviour Support", requirement: "PBS plans reviewed every 90 days", status: "met", lastEvidence: "All 6 active PBS plans within review window", owner: "PBS lead" },
  { id: "a6", domain: "Safeguarding", requirement: "All safeguarding concerns escalated to designated lead within 4 hours", status: "met", lastEvidence: "Avg escalation time 51 minutes, last 30 days", owner: "Safeguarding lead" },
  { id: "a7", domain: "Restrictive Practice Reporting", requirement: "Restraint / restrictive practice incidents reported to CQC & local authority within statutory timeframe", status: "gap", lastEvidence: "1 incident (Aug 21) not yet submitted, due tomorrow", owner: "Registered manager" },
  { id: "a8", domain: "Communication & Consent", requirement: "Easy-read consent & care plan documentation on file for all individuals", status: "met", lastEvidence: "8 of 8 individuals have current easy-read documentation", owner: "Care coordinators" },
];

export const upcomingAudits = [
  { name: "CQC Inspection", date: "Sep 18, 2026", readiness: 79 },
  { name: "Local Authority Contract Monitoring Visit", date: "Sep 5, 2026", readiness: 88 },
  { name: "Internal PBS & Restrictive Practice Audit", date: "Aug 29, 2026", readiness: 71 },
];

export interface SupportThread {
  id: string;
  individualId: string;
  contact: string;
  relation: string;
  lastMessage: string;
  timestamp: string;
  status: "awaiting-reply" | "draft-ready" | "sent";
  channel: "SMS" | "App" | "Email" | "Easy-read letter";
}

export const supportThreads: SupportThread[] = [
  { id: "f1", individualId: "p1", contact: "Sandra Whitcombe", relation: "Mother", lastMessage: "Did the supermarket trip go okay today? Jamie mentioned it was busy when he called.", timestamp: "22 min ago", status: "draft-ready", channel: "App" },
  { id: "f2", individualId: "p4", contact: "Naima Rahman", relation: "Sister", lastMessage: "Weekly update requested ahead of Aisha's DoLS renewal meeting", timestamp: "1 hr ago", status: "draft-ready", channel: "Email" },
  { id: "f3", individualId: "p3", contact: "Michael Fitzgerald", relation: "Father", lastMessage: "Thanks for flagging the lighting issue so quickly, appreciate the update.", timestamp: "3 hr ago", status: "sent", channel: "SMS" },
  { id: "f4", individualId: "p2", contact: "Fiona Yang", relation: "Social worker", lastMessage: "Can you send this month's activity log ahead of Priya's review?", timestamp: "5 hr ago", status: "awaiting-reply", channel: "Email" },
  { id: "f5", individualId: "p8", contact: "Maisie Doyle", relation: "Self (easy-read)", lastMessage: "Weekly easy-read update requested by advocate", timestamp: "Yesterday", status: "draft-ready", channel: "Easy-read letter" },
];

export const supportDrafts: Record<string, string> = {
  f1: "Hi Sandra — thank you for checking in. The supermarket trip today was harder than usual: the queue was longer than planned, which is something we know can be difficult for Jamie. He asked to leave a few times and our team supported him out to the car calmly, using his train podcast to help him settle — he was back to himself within a few minutes. No one was hurt. We're going to add a strategy to his PBS plan for waiting times before the next trip. Happy to talk it through on a call this week.",
  f2: "Hello Naima — here is Aisha's update ahead of the DoLS renewal meeting. She's continued to engage well with her psychology sessions and has been drawing a lot this week, which she finds calming. Her authorisation is due to expire in 12 days; the renewal paperwork has already been submitted and we don't expect any gap in her safeguards. We'll confirm the meeting date as soon as it's set.",
  f5: "Hello Maisie. Here is your update for this week, written for you. You went to the day service every day. You watched your favourite film on Tuesday. You used your fidget toy when it was time to change rooms and that helped. Everyone is proud of you this week.",
};

export interface RiskEntry {
  individualId: string;
  escalationRisk: number;
  placementStabilityRisk: number;
  primaryDrivers: string[];
  trend: "up" | "down" | "flat";
}

export const riskEntries: RiskEntry[] = [
  { individualId: "p1", escalationRisk: 72, placementStabilityRisk: 38, primaryDrivers: ["Repeated queue/waiting triggers, 3x in 30 days", "OT sessions falling behind schedule", "Upcoming annual review"], trend: "up" },
  { individualId: "p3", escalationRisk: 58, placementStabilityRisk: 27, primaryDrivers: ["Self-injurious behaviour during transitions", "Reduced food intake, cause unclear", "Environmental sensory triggers identified"], trend: "up" },
  { individualId: "p4", escalationRisk: 44, placementStabilityRisk: 51, primaryDrivers: ["DoLS authorisation expiring in 12 days", "OT sensory diet sessions missed", "Anxiety ahead of placement review"], trend: "up" },
  { individualId: "p8", escalationRisk: 41, placementStabilityRisk: 24, primaryDrivers: ["Transition-related distress in group settings", "Near miss during fire alarm test"], trend: "flat" },
  { individualId: "p6", escalationRisk: 36, placementStabilityRisk: 22, primaryDrivers: ["Possible pre-seizure agitation pattern", "Stable physiotherapy adherence"], trend: "down" },
];

export interface OvershadowingFlag {
  individualId: string;
  label: string;
  detail: string;
  severity: "info" | "watch" | "urgent";
}

export const overshadowingFlags: OvershadowingFlag[] = [
  { individualId: "p3", label: "Possible undiagnosed pain — dental", detail: "Increased self-injurious head-hitting near mealtimes combined with reduced intake over 4 days. Pattern matches oral discomfort more than behavioural escalation alone — GP/dental referral recommended before adjusting the PBS plan.", severity: "urgent" },
  { individualId: "p6", label: "Possible pre-ictal pattern", detail: "Increased vocalisation and hand-wringing 30-60 minutes before two of her last three recorded seizures. Neurology team not yet notified of this pattern.", severity: "watch" },
  { individualId: "p1", label: "Behaviour change may reflect anxiety, not defiance", detail: "Rising queue/waiting-related escalations could reflect situational anxiety rather than a support plan failure — consider before increasing restrictive elements of PBS plan.", severity: "info" },
];

export interface PBSPlanEffectiveness {
  individualId: string;
  planFocus: string;
  effectivenessScore: number;
  trend: "improving" | "stable" | "declining";
  note: string;
}

export const pbsPlanEffectiveness: PBSPlanEffectiveness[] = [
  { individualId: "p1", planFocus: "Reducing exit-seeking during unplanned waits", effectivenessScore: 48, trend: "declining", note: "Frequency of queue-related escalations increasing despite current strategy — recommend plan revision, not just reinforcement." },
  { individualId: "p3", planFocus: "Function-based plan for mealtime self-injury", effectivenessScore: 66, trend: "improving", note: "Sensory environment changes (lighting/noise) reducing episode severity, frequency still elevated." },
  { individualId: "p8", planFocus: "Graded exposure to messy/textured play", effectivenessScore: 74, trend: "improving", note: "Tolerance building steadily over 6 weeks of OT-led sessions." },
  { individualId: "p2", planFocus: "Maintaining independence in daily routines", effectivenessScore: 82, trend: "stable", note: "Consistent engagement, no plan changes needed this cycle." },
];

export interface SupportDemandPoint {
  day: string;
  predictedHours: number;
  scheduledHours: number;
}

export const supportDemandForecast: SupportDemandPoint[] = [
  { day: "Mon", predictedHours: 142, scheduledHours: 138 },
  { day: "Tue", predictedHours: 148, scheduledHours: 140 },
  { day: "Wed", predictedHours: 156, scheduledHours: 142 },
  { day: "Thu", predictedHours: 151, scheduledHours: 146 },
  { day: "Fri", predictedHours: 149, scheduledHours: 148 },
  { day: "Sat", predictedHours: 132, scheduledHours: 130 },
  { day: "Sun", predictedHours: 128, scheduledHours: 118 },
];

export interface StaffMember {
  id: string;
  name: string;
  role: "Support Worker" | "Senior Support Worker" | "Keyworker" | "PBS Practitioner" | "Registered Manager";
  home: Home;
  assignedRatio: "1:1" | "2:1" | "1:2" | "1:4";
  hoursOnShift: number;
  taskLoad: number;
  burnoutSignal: "none" | "watch" | "elevated";
  status: "available" | "with-individual" | "break" | "handover" | "overloaded";
}

export const staff: StaffMember[] = [
  { id: "s1", name: "Deshawn Marsh", role: "Keyworker", home: "Willow House", assignedRatio: "1:1", hoursOnShift: 7.4, taskLoad: 82, burnoutSignal: "watch", status: "with-individual" },
  { id: "s2", name: "Amara Okafor", role: "Senior Support Worker", home: "Cedar Court", assignedRatio: "1:2", hoursOnShift: 5.1, taskLoad: 54, burnoutSignal: "none", status: "available" },
  { id: "s3", name: "Grace Tan", role: "Keyworker", home: "Magnolia Hub", assignedRatio: "1:1", hoursOnShift: 6.8, taskLoad: 88, burnoutSignal: "elevated", status: "overloaded" },
  { id: "s4", name: "Lucia Fernandez", role: "Senior Support Worker", home: "Birchwood Lodge", assignedRatio: "1:2", hoursOnShift: 8.2, taskLoad: 63, burnoutSignal: "watch", status: "handover" },
  { id: "s5", name: "Marisol Ibarra", role: "Support Worker", home: "Willow House", assignedRatio: "1:4", hoursOnShift: 3.5, taskLoad: 41, burnoutSignal: "none", status: "available" },
  { id: "s6", name: "Tobias Kraus", role: "PBS Practitioner", home: "Cedar Court", assignedRatio: "2:1", hoursOnShift: 4.6, taskLoad: 58, burnoutSignal: "none", status: "with-individual" },
  { id: "s7", name: "Femi Adeyemi", role: "Support Worker", home: "Magnolia Hub", assignedRatio: "1:4", hoursOnShift: 9.1, taskLoad: 91, burnoutSignal: "elevated", status: "overloaded" },
  { id: "s8", name: "Priya Nair", role: "Support Worker", home: "Magnolia Hub", assignedRatio: "1:2", hoursOnShift: 2.9, taskLoad: 37, burnoutSignal: "none", status: "break" },
];

export interface InventoryItem {
  id: string;
  name: string;
  category: "PPE" | "Sensory Equipment" | "Communication Aids" | "Medication Supplies" | "Activity Supplies";
  onHand: number;
  parLevel: number;
  unit: string;
  daysOfSupply: number;
  status: "ok" | "low" | "critical";
}

export const inventory: InventoryItem[] = [
  { id: "inv1", name: "Nitrile gloves (M)", category: "PPE", onHand: 620, parLevel: 900, unit: "pcs", daysOfSupply: 7, status: "low" },
  { id: "inv2", name: "Weighted blankets (5kg)", category: "Sensory Equipment", onHand: 3, parLevel: 8, unit: "pcs", daysOfSupply: 0, status: "critical" },
  { id: "inv3", name: "Noise-cancelling headphones", category: "Sensory Equipment", onHand: 6, parLevel: 10, unit: "pcs", daysOfSupply: 0, status: "low" },
  { id: "inv4", name: "AAC device chargers", category: "Communication Aids", onHand: 4, parLevel: 6, unit: "pcs", daysOfSupply: 0, status: "low" },
  { id: "inv5", name: "PECS card sets", category: "Communication Aids", onHand: 14, parLevel: 15, unit: "sets", daysOfSupply: 0, status: "ok" },
  { id: "inv6", name: "Anti-epileptic medication (rescue)", category: "Medication Supplies", onHand: 9, parLevel: 10, unit: "kits", daysOfSupply: 0, status: "ok" },
  { id: "inv7", name: "Fidget & chew-safe toys", category: "Activity Supplies", onHand: 22, parLevel: 40, unit: "pcs", daysOfSupply: 0, status: "low" },
  { id: "inv8", name: "Sensory room bulbs (colour-changing)", category: "Sensory Equipment", onHand: 2, parLevel: 12, unit: "pcs", daysOfSupply: 0, status: "critical" },
];

export interface RoomInfo {
  id: string;
  label: string;
  home: Home;
  purpose: "Bedroom" | "Sensory Room" | "Quiet / Low-arousal Room" | "Communal Lounge" | "Activity Room";
  occupant: string | null;
  status: "in-use" | "available" | "turnover" | "maintenance";
}

export const rooms: RoomInfo[] = [
  { id: "rm1", label: "Willow — Room 1", home: "Willow House", purpose: "Bedroom", occupant: "Jamie Whitcombe", status: "in-use" },
  { id: "rm2", label: "Willow — Room 3", home: "Willow House", purpose: "Bedroom", occupant: "Callum Wren", status: "in-use" },
  { id: "rm3", label: "Willow — Quiet Room", home: "Willow House", purpose: "Quiet / Low-arousal Room", occupant: null, status: "available" },
  { id: "rm4", label: "Cedar — Room 2", home: "Cedar Court", purpose: "Bedroom", occupant: "Priya Chandran", status: "in-use" },
  { id: "rm5", label: "Cedar — Room 5", home: "Cedar Court", purpose: "Bedroom", occupant: "Freya Lindqvist", status: "in-use" },
  { id: "rm6", label: "Cedar — Sensory Room", home: "Cedar Court", purpose: "Sensory Room", occupant: null, status: "maintenance" },
  { id: "rm7", label: "Birchwood — Room 1", home: "Birchwood Lodge", purpose: "Bedroom", occupant: "Aisha Rahman", status: "in-use" },
  { id: "rm8", label: "Birchwood — Lounge", home: "Birchwood Lodge", purpose: "Communal Lounge", occupant: null, status: "available" },
  { id: "rm9", label: "Magnolia — Activity Room A", home: "Magnolia Hub", purpose: "Activity Room", occupant: null, status: "in-use" },
  { id: "rm10", label: "Magnolia — Sensory Room", home: "Magnolia Hub", purpose: "Sensory Room", occupant: null, status: "turnover" },
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
  { id: "mt1", title: "Sensory room fibre-optic lighting unit not working", location: "Cedar Court", priority: "high", status: "in-progress", raisedBy: "Tobias Kraus", age: "1 day" },
  { id: "mt2", title: "Fluorescent light flickering near serving hatch", location: "Magnolia Hub", priority: "high", status: "open", raisedBy: "Grace Tan", age: "4 hrs" },
  { id: "mt3", title: "Door alarm sensitivity too high, false-triggering", location: "Willow House", priority: "medium", status: "scheduled", raisedBy: "Deshawn Marsh", age: "2 days" },
  { id: "mt4", title: "AAC device charging dock loose connection", location: "Magnolia Hub", priority: "medium", status: "open", raisedBy: "Grace Tan", age: "6 hrs" },
  { id: "mt5", title: "Garden gate lock sticking", location: "Birchwood Lodge", priority: "low", status: "open", raisedBy: "Lucia Fernandez", age: "3 days" },
];

export interface ActivityBooking {
  id: string;
  individualName: string;
  activity: string;
  date: string;
  transport: "Minibus" | "Taxi" | "Public transport (supported)" | "Walking";
  supportRatio: string;
  status: "confirmed" | "pending" | "needs-driver";
}

export const activityBookings: ActivityBooking[] = [
  { id: "ab1", individualName: "Jamie Whitcombe", activity: "Railway museum visit", date: "Tomorrow, 10:00", transport: "Minibus", supportRatio: "1:1", status: "confirmed" },
  { id: "ab2", individualName: "Priya Chandran", activity: "Community baking group", date: "Tomorrow, 13:00", transport: "Walking", supportRatio: "1:2", status: "confirmed" },
  { id: "ab3", individualName: "Tyrone Osei", activity: "Warehouse work placement", date: "Today, 08:00", transport: "Public transport (supported)", supportRatio: "1:4", status: "confirmed" },
  { id: "ab4", individualName: "Callum Wren", activity: "Football coaching session", date: "Fri, 16:00", transport: "Minibus", supportRatio: "1:4", status: "needs-driver" },
  { id: "ab5", individualName: "Maisie Doyle", activity: "Cinema — sensory-friendly screening", date: "Sat, 11:00", transport: "Taxi", supportRatio: "1:2", status: "pending" },
];

export function individualById(id: string): Individual | undefined {
  return individuals.find((p) => p.id === id);
}
export function staffById(id: string): StaffMember | undefined {
  return staff.find((s) => s.id === id);
}
