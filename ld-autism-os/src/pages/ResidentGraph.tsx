import { useState } from "react";
import {
  MessageSquareHeart,
  Waves,
  Activity,
  Users,
  Milestone,
  ClipboardList,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Wind,
} from "lucide-react";
import clsx from "clsx";
import { Card, Badge, SectionHeading, Avatar, ProgressBar } from "../components/ui/Primitives";
import RelationshipGraph, { type GraphNode } from "../components/RelationshipGraph";
import {
  individuals,
  therapyPlans,
  sensoryProfiles,
  circleOfSupport,
  journeyEvents,
  individualById,
} from "../lib/mockData";

type FocusKey = "diagnoses" | "passport" | "sensory" | "therapy" | "circle" | "journey";

const dolsTone: Record<string, "moss" | "amber" | "rose" | "ink"> = {
  authorised: "moss",
  pending: "amber",
  "expiring-soon": "rose",
  none: "ink",
};

export default function ResidentGraph() {
  const [selectedId, setSelectedId] = useState(individuals[0].id);
  const [focus, setFocus] = useState<FocusKey>("passport");
  const person = individualById(selectedId)!;

  const therapies = therapyPlans.filter((t) => t.individualId === selectedId);
  const sensory = sensoryProfiles.filter((s) => s.individualId === selectedId);
  const circle = circleOfSupport.filter((c) => c.individualId === selectedId);
  const journey = journeyEvents.filter((j) => j.individualId === selectedId);

  const nodes: GraphNode[] = [
    { id: "diagnoses", label: "Diagnoses", icon: ClipboardList, tone: "ink", count: person.diagnoses.length },
    { id: "passport", label: "Communication passport", icon: MessageSquareHeart, tone: "moss" },
    { id: "sensory", label: "Sensory profile", icon: Waves, tone: "sky", count: sensory.length },
    { id: "therapy", label: "Therapy & adherence", icon: Activity, tone: "clay", count: therapies.length },
    { id: "circle", label: "Circle of support", icon: Users, tone: "amber", count: circle.length },
    { id: "journey", label: "Life journey", icon: Milestone, tone: "rose", count: journey.length },
  ];

  function selectPerson(id: string) {
    setSelectedId(id);
    setFocus("passport");
  }

  return (
    <div className="animate-fade-in-up">
      <SectionHeading
        eyebrow="Resident Graph"
        title="One person, one connected picture"
        description="Diagnosis history, communication needs, sensory profile, therapy design, and circle of support — linked in a single view so nothing about a person's journey gets lost between teams."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
        <Card padded={false} className="h-fit">
          <div className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">People supported</div>
          <div className="divide-y divide-ink-100 max-h-[600px] overflow-y-auto scrollbar-thin">
            {individuals.map((p) => (
              <button
                key={p.id}
                onClick={() => selectPerson(p.id)}
                className={clsx("w-full text-left px-4 py-3 hover:bg-ink-50 transition-colors flex items-center gap-2.5", selectedId === p.id && "bg-moss-50")}
              >
                <Avatar initials={p.photoInitials} size={30} tone={p.escalationRisk > 60 ? "rose" : p.escalationRisk > 40 ? "amber" : "moss"} />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-ink-800 truncate">{p.name}</div>
                  <div className="text-[11px] text-ink-400 truncate">{p.home}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-5 min-w-0">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar initials={person.photoInitials} size={44} tone={person.escalationRisk > 60 ? "rose" : "moss"} />
                <div>
                  <div className="text-base font-semibold text-ink-800">{person.name}, {person.age}</div>
                  <div className="text-xs text-ink-500 mt-0.5">{person.service} &middot; {person.home} &middot; keyworker {person.keyworker}</div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {person.diagnoses.map((d) => (
                      <Badge key={d} tone="ink">{d}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-[11px] text-ink-400">Escalation risk</div>
                  <div className={clsx("font-display text-2xl", person.escalationRisk > 60 ? "text-rose-600" : person.escalationRisk > 40 ? "text-amber-600" : "text-moss-600")}>
                    {person.escalationRisk}<span className="text-sm text-ink-400">/100</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-ink-400">DoLS status</div>
                  <Badge tone={dolsTone[person.dolsStatus]} className="capitalize mt-1">{person.dolsStatus.replace("-", " ")}</Badge>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-center mb-1">
              <h2 className="font-display text-lg text-ink-900">Connected profile</h2>
              <p className="text-xs text-ink-500">Select a node to see what's behind it</p>
            </div>
            <RelationshipGraph
              centerInitials={person.photoInitials}
              centerLabel={person.name}
              nodes={nodes}
              activeId={focus}
              onSelect={(id) => setFocus(id as FocusKey)}
            />
          </Card>

          <Card className="animate-fade-in-up">
            {focus === "diagnoses" && (
              <FocusHeader icon={ClipboardList} title="Diagnoses & communication" />
            )}
            {focus === "diagnoses" && (
              <div className="grid sm:grid-cols-2 gap-5 mt-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-2">Diagnoses</div>
                  <ul className="space-y-1.5 text-[13.5px] text-ink-700">
                    {person.diagnoses.map((d) => <li key={d}>&bull; {d}</li>)}
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-2">Communication profile</div>
                  <ul className="space-y-1.5 text-[13.5px] text-ink-700">
                    {person.communicationProfile.map((d) => <li key={d}>&bull; {d}</li>)}
                  </ul>
                </div>
              </div>
            )}

            {focus === "passport" && (
              <>
                <FocusHeader icon={MessageSquareHeart} title="Communication passport" />
                <div className="grid sm:grid-cols-2 gap-4 mt-3">
                  <PassportBlock icon={ThumbsUp} tone="moss" title="Likes" items={person.passport.likes} />
                  <PassportBlock icon={ThumbsDown} tone="rose" title="Dislikes" items={person.passport.dislikes} />
                  <PassportBlock icon={Zap} tone="amber" title="Triggers" items={person.passport.triggers} />
                  <PassportBlock icon={Wind} tone="sky" title="Calming strategies" items={person.passport.calmingStrategies} />
                </div>
              </>
            )}

            {focus === "sensory" && (
              <>
                <FocusHeader icon={Waves} title="Sensory profile" />
                {sensory.length === 0 && <p className="text-sm text-ink-400 mt-2">No sensory profile entries logged for {person.name} yet.</p>}
                <div className="space-y-3 mt-3">
                  {sensory.map((s, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl border border-ink-100 p-3">
                      <Badge tone={s.pattern === "avoids" ? "rose" : s.pattern === "seeks" ? "moss" : "ink"} className="capitalize shrink-0 mt-0.5">{s.pattern}</Badge>
                      <div>
                        <div className="text-[13.5px] font-semibold text-ink-800">{s.domain}</div>
                        <div className="text-xs text-ink-500 mt-0.5">{s.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {focus === "therapy" && (
              <>
                <FocusHeader icon={Activity} title="Therapy design & adherence" />
                {therapies.length === 0 && <p className="text-sm text-ink-400 mt-2">No active therapy plans for {person.name}.</p>}
                <div className="divide-y divide-ink-100 mt-2">
                  {therapies.map((t) => (
                    <div key={t.id} className="py-3.5">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[13px] font-semibold text-ink-800">{t.discipline}</span>
                        <Badge tone={t.trend === "declining" ? "rose" : t.trend === "improving" ? "moss" : "ink"} className="capitalize shrink-0">{t.trend}</Badge>
                      </div>
                      <p className="text-xs text-ink-500 mb-2">{t.goal}</p>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="flex-1"><ProgressBar value={t.adherence} tone={t.adherence > 70 ? "moss" : t.adherence > 40 ? "amber" : "rose"} /></div>
                        <span className="text-xs font-semibold text-ink-700 shrink-0">{t.sessionsAttended}/{t.sessionsPlanned} sessions</span>
                      </div>
                      <div className="text-[11px] text-ink-400">Last: {t.lastSession} &middot; Next: {t.nextSession}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {focus === "circle" && (
              <>
                <FocusHeader icon={Users} title="Circle of support" />
                {circle.length === 0 && <p className="text-sm text-ink-400 mt-2">No contacts recorded for {person.name} yet.</p>}
                <div className="grid sm:grid-cols-2 gap-3 mt-3">
                  {circle.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-ink-100 p-3">
                      <Avatar initials={c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)} size={32} tone="amber" />
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-ink-800 truncate">{c.name}</div>
                        <div className="text-xs text-ink-500">{c.relation}</div>
                        <div className="text-[11px] text-ink-400">{c.contactFrequency}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {focus === "journey" && (
              <>
                <FocusHeader icon={Milestone} title="Life journey" />
                {journey.length === 0 && <p className="text-sm text-ink-400 mt-2">No journey events recorded for {person.name} yet.</p>}
                <div className="mt-3 space-y-4">
                  {journey.map((j, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center shrink-0 pt-0.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                        {i < journey.length - 1 && <span className="w-px flex-1 bg-ink-200 mt-1" />}
                      </div>
                      <div className="pb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold text-ink-800">{j.label}</span>
                          <span className="text-[11px] text-ink-400">{j.date}</span>
                        </div>
                        <p className="text-xs text-ink-500 mt-0.5">{j.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function FocusHeader({ icon: Icon, title }: { icon: typeof Users; title: string }) {
  return (
    <h2 className="font-display text-lg text-ink-900 flex items-center gap-2">
      <Icon size={17} className="text-moss-600" /> {title}
    </h2>
  );
}

function PassportBlock({
  icon: Icon,
  tone,
  title,
  items,
}: {
  icon: typeof ThumbsUp;
  tone: "moss" | "rose" | "amber" | "sky";
  title: string;
  items: string[];
}) {
  const toneText: Record<string, string> = { moss: "text-moss-600", rose: "text-rose-600", amber: "text-amber-600", sky: "text-sky-600" };
  return (
    <div className="rounded-xl border border-ink-100 p-3.5">
      <div className={clsx("flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-2", toneText[tone])}>
        <Icon size={13} /> {title}
      </div>
      <ul className="space-y-1 text-[13px] text-ink-700">
        {items.map((it) => <li key={it}>&bull; {it}</li>)}
      </ul>
    </div>
  );
}
