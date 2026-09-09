import { useState } from "react";
import {
  ClipboardList,
  Waves,
  Activity,
  Users,
  Milestone,
  ThumbsUp,
  ThumbsDown,
  Zap,
  ShieldAlert,
  TrendingUp,
  History,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";
import { Card, Badge, SectionHeading, Avatar, ProgressBar } from "../components/ui/Primitives";
import {
  individuals,
  therapyPlans,
  sensoryProfiles,
  circleOfSupport,
  journeyEvents,
  behaviouralEvents,
  patternShifts,
  individualById,
  type BehaviouralEvent,
  type PatternShift,
} from "../lib/mockData";

const dolsTone: Record<string, "moss" | "amber" | "rose" | "ink"> = {
  authorised: "moss",
  pending: "amber",
  "expiring-soon": "rose",
  none: "ink",
};

const outcomeTone: Record<BehaviouralEvent["outcome"], "moss" | "amber" | "rose"> = {
  resolved: "moss",
  "partially-resolved": "amber",
  escalated: "rose",
};
const outcomeLabel: Record<BehaviouralEvent["outcome"], string> = {
  resolved: "Resolved",
  "partially-resolved": "Partially resolved",
  escalated: "Escalated",
};
const severityTone: Record<BehaviouralEvent["severity"], "sky" | "amber" | "rose"> = {
  low: "sky",
  moderate: "amber",
  high: "rose",
};
const shiftSeverityTone: Record<PatternShift["severity"], "sky" | "amber" | "rose"> = {
  info: "sky",
  watch: "amber",
  urgent: "rose",
};
const shiftIcon: Record<PatternShift["kind"], typeof Zap> = {
  "emerging-trigger": Zap,
  "strategy-effectiveness": Activity,
  "frequency-change": TrendingUp,
  "process-gap": ClipboardList,
};
const shiftIconTone: Record<PatternShift["severity"], string> = {
  info: "bg-sky-100 text-sky-600",
  watch: "bg-amber-100 text-amber-600",
  urgent: "bg-rose-100 text-rose-600",
};

function strategyLeaderboard(events: BehaviouralEvent[]) {
  const map = new Map<string, { count: number; score: number }>();
  for (const e of events) {
    const cur = map.get(e.strategy) ?? { count: 0, score: 0 };
    cur.count += 1;
    cur.score += e.outcome === "resolved" ? 1 : e.outcome === "partially-resolved" ? 0.5 : 0;
    map.set(e.strategy, cur);
  }
  return Array.from(map.entries())
    .map(([strategy, { count, score }]) => ({ strategy, count, effectiveness: Math.round((score / count) * 100) }))
    .sort((a, b) => b.effectiveness - a.effectiveness || b.count - a.count);
}

function Sparkline({ values, tone }: { values: number[]; tone: "moss" | "amber" | "rose" }) {
  const colorMap = { moss: "#297166", amber: "#b5871c", rose: "#bd4b41" };
  const w = 60;
  const h = 22;
  const pad = 3;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = pad + (1 - v / 100) * (h - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");
  const lastY = pad + (1 - values[values.length - 1] / 100) * (h - pad * 2);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0" aria-hidden="true">
      <polyline points={pts} fill="none" stroke={colorMap[tone]} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={lastY} r={2.25} fill={colorMap[tone]} />
    </svg>
  );
}

export default function ResidentGraph() {
  const [selectedId, setSelectedId] = useState(individuals[0].id);
  const person = individualById(selectedId)!;

  const events = behaviouralEvents.filter((e) => e.individualId === selectedId).slice().reverse();
  const shifts = patternShifts.filter((s) => s.individualId === selectedId);
  const therapies = therapyPlans.filter((t) => t.individualId === selectedId);
  const sensory = sensoryProfiles.filter((s) => s.individualId === selectedId);
  const circle = circleOfSupport.filter((c) => c.individualId === selectedId);
  const journey = journeyEvents.filter((j) => j.individualId === selectedId);
  const leaderboard = strategyLeaderboard(events);

  function selectPerson(id: string) {
    setSelectedId(id);
  }

  return (
    <div className="animate-fade-in-up">
      <SectionHeading
        eyebrow="Resident Graph"
        title="Behaviour, strategy and adherence — in one view"
        description="Every ABC entry, the de-escalation strategy tried, and whether it worked, lined up per person — with the pattern shifts across them surfaced automatically instead of hand-charted."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
        <Card padded={false} className="h-fit">
          <div className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">People supported</div>
          <div className="divide-y divide-ink-100 max-h-[600px] overflow-y-auto scrollbar-thin">
            {individuals.map((p) => {
              const count = behaviouralEvents.filter((e) => e.individualId === p.id).length;
              return (
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
                  {count > 0 && <Badge tone="ink">{count}</Badge>}
                </button>
              );
            })}
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

          <Card className={shifts.length > 0 ? "border-amber-200 bg-amber-50/50" : undefined}>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={17} className={shifts.length > 0 ? "text-amber-600" : "text-moss-600"} />
              <h2 className="font-display text-lg text-ink-900">Pattern shifts detected</h2>
            </div>
            <p className="text-xs text-ink-500 mb-3 max-w-2xl">
              Surfaced automatically from the behavioural log below — the kind of cross-episode trend a psychology or PBS
              team would otherwise have to notice by hand-charting paper ABC forms.
            </p>
            {shifts.length === 0 ? (
              <p className="text-sm text-ink-400">No emerging patterns detected in {person.name}'s recent history.</p>
            ) : (
              <div className="space-y-2.5">
                {shifts.map((s, i) => {
                  const Icon = shiftIcon[s.kind];
                  return (
                    <div key={i} className="flex items-start gap-3 rounded-xl border border-ink-100 bg-white p-3">
                      <div className={clsx("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", shiftIconTone[s.severity])}>
                        <Icon size={15} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[13.5px] font-semibold text-ink-800">{s.title}</div>
                          <Badge tone={shiftSeverityTone[s.severity]} className="capitalize shrink-0">{s.severity}</Badge>
                        </div>
                        <div className="text-xs text-ink-500 mt-1">{s.detail}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
            <Card padded={false}>
              <div className="p-5 pb-3 flex items-center gap-2">
                <History size={17} className="text-ink-600" />
                <h2 className="font-display text-lg text-ink-900">Behavioural history</h2>
                <span className="text-xs font-normal text-ink-400">&middot; {events.length} logged episodes</span>
              </div>
              {events.length === 0 ? (
                <p className="text-sm text-ink-400 px-5 pb-5">No behavioural episodes logged for {person.name}.</p>
              ) : (
                <div className="divide-y divide-ink-100 max-h-[640px] overflow-y-auto scrollbar-thin">
                  {events.map((e) => (
                    <div key={e.id} className="px-5 py-4">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{e.date}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {e.restrictivePracticeUsed && (
                            <Badge tone="rose"><ShieldAlert size={11} /> Restrictive practice</Badge>
                          )}
                          <Badge tone={severityTone[e.severity]} className="capitalize">{e.severity}</Badge>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-x-4 gap-y-1.5 text-[13px]">
                        <div><span className="text-ink-400">Antecedent — </span><span className="text-ink-700">{e.antecedent}</span></div>
                        <div><span className="text-ink-400">Behaviour — </span><span className="text-ink-700">{e.behaviour}</span></div>
                        <div><span className="text-ink-400">Strategy — </span><span className="text-ink-700">{e.strategy}</span></div>
                      </div>
                      <div className="mt-2">
                        <Badge tone={outcomeTone[e.outcome]}>{outcomeLabel[e.outcome]}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <div className="space-y-5">
              <Card>
                <h2 className="font-display text-base text-ink-900 mb-1 flex items-center gap-2">
                  <ThumbsUp size={15} className="text-moss-600" /> What's working
                </h2>
                <p className="text-xs text-ink-500 mb-3">De-escalation strategies ranked by how often they've fully resolved an episode.</p>
                {leaderboard.length === 0 ? (
                  <p className="text-sm text-ink-400">No strategies logged yet.</p>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.map((l) => (
                      <div key={l.strategy}>
                        <div className="flex items-center justify-between gap-2 text-[12.5px] mb-1">
                          <span className="font-medium text-ink-800">{l.strategy}</span>
                          <span className="text-ink-500 shrink-0">{l.effectiveness}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1"><ProgressBar value={l.effectiveness} tone={l.effectiveness >= 75 ? "moss" : l.effectiveness >= 50 ? "amber" : "rose"} /></div>
                          <span className="text-[11px] text-ink-400 shrink-0">used {l.count}&times;</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card>
                <h2 className="font-display text-base text-ink-900 mb-3 flex items-center gap-2">
                  <Zap size={15} className="text-amber-600" /> Known triggers &amp; calming strategies
                </h2>
                <div className="space-y-3">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-400 mb-1.5">Triggers</div>
                    <ul className="space-y-1 text-[12.5px] text-ink-700">
                      {person.passport.triggers.map((t) => <li key={t}>&bull; {t}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-400 mb-1.5">Calming strategies</div>
                    <ul className="space-y-1 text-[12.5px] text-ink-700">
                      {person.passport.calmingStrategies.map((t) => <li key={t}>&bull; {t}</li>)}
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <Card padded={false}>
            <div className="p-5 pb-3 flex items-center gap-2">
              <Activity size={17} className="text-clay-600" />
              <h2 className="font-display text-lg text-ink-900">Therapy &amp; PBS plan adherence</h2>
            </div>
            {therapies.length === 0 ? (
              <p className="text-sm text-ink-400 px-5 pb-5">No active therapy plans for {person.name}.</p>
            ) : (
              <div className="divide-y divide-ink-100">
                {therapies.map((t) => (
                  <div key={t.id} className="px-5 py-4">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[13px] font-semibold text-ink-800">{t.discipline}</span>
                      <Badge tone={t.trend === "declining" ? "rose" : t.trend === "improving" ? "moss" : "ink"} className="capitalize shrink-0">{t.trend}</Badge>
                    </div>
                    <p className="text-xs text-ink-500 mb-2.5">{t.goal}</p>
                    <div className="flex items-center gap-3">
                      <Sparkline values={t.adherenceHistory} tone={t.adherence >= 70 ? "moss" : t.adherence >= 40 ? "amber" : "rose"} />
                      <div className="flex-1">
                        <ProgressBar value={t.adherence} tone={t.adherence >= 70 ? "moss" : t.adherence >= 40 ? "amber" : "rose"} />
                        <div className="flex items-center justify-between mt-1 text-[11px] text-ink-400">
                          <span>{t.sessionsAttended}/{t.sessionsPlanned} sessions this cycle</span>
                          <span>Last: {t.lastSession} &middot; Next: {t.nextSession}</span>
                        </div>
                      </div>
                      <span className="text-[13px] font-semibold text-ink-700 shrink-0 w-10 text-right">{t.adherence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div className="grid sm:grid-cols-2 gap-5">
            <Card>
              <h2 className="font-display text-base text-ink-900 mb-3 flex items-center gap-2">
                <Waves size={15} className="text-sky-600" /> Sensory profile
              </h2>
              {sensory.length === 0 ? (
                <p className="text-sm text-ink-400">No sensory profile entries logged.</p>
              ) : (
                <div className="space-y-2.5">
                  {sensory.map((s, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Badge tone={s.pattern === "avoids" ? "rose" : s.pattern === "seeks" ? "moss" : "ink"} className="capitalize shrink-0 mt-0.5">{s.pattern}</Badge>
                      <div>
                        <div className="text-[12.5px] font-semibold text-ink-800">{s.domain}</div>
                        <div className="text-xs text-ink-500">{s.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <h2 className="font-display text-base text-ink-900 mb-3 flex items-center gap-2">
                <Users size={15} className="text-amber-600" /> Circle of support
              </h2>
              {circle.length === 0 ? (
                <p className="text-sm text-ink-400">No contacts recorded.</p>
              ) : (
                <div className="space-y-2.5">
                  {circle.map((c, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <Avatar initials={c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)} size={28} tone="amber" />
                      <div className="min-w-0">
                        <div className="text-[12.5px] font-semibold text-ink-800 truncate">{c.name}</div>
                        <div className="text-xs text-ink-500">{c.relation} &middot; {c.contactFrequency}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <h2 className="font-display text-base text-ink-900 mb-3 flex items-center gap-2">
                <ClipboardList size={15} className="text-ink-600" /> Diagnoses &amp; communication
              </h2>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-400 mb-1.5">Communication profile</div>
              <ul className="space-y-1 text-[12.5px] text-ink-700 mb-3">
                {person.communicationProfile.map((d) => <li key={d}>&bull; {d}</li>)}
              </ul>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-400 mb-1.5">Likes &amp; dislikes</div>
              <div className="flex flex-wrap gap-1.5">
                {person.passport.likes.map((l) => <Badge key={l} tone="moss"><ThumbsUp size={10} />{l}</Badge>)}
                {person.passport.dislikes.map((l) => <Badge key={l} tone="rose"><ThumbsDown size={10} />{l}</Badge>)}
              </div>
            </Card>

            <Card>
              <h2 className="font-display text-base text-ink-900 mb-3 flex items-center gap-2">
                <Milestone size={15} className="text-rose-500" /> Life journey
              </h2>
              {journey.length === 0 ? (
                <p className="text-sm text-ink-400">No journey events recorded.</p>
              ) : (
                <div className="space-y-3 max-h-[220px] overflow-y-auto scrollbar-thin pr-1">
                  {journey.map((j, i) => (
                    <div key={i} className="flex gap-2.5">
                      <div className="flex flex-col items-center shrink-0 pt-0.5">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        {i < journey.length - 1 && <span className="w-px flex-1 bg-ink-200 mt-1" />}
                      </div>
                      <div className="pb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[12.5px] font-semibold text-ink-800">{j.label}</span>
                          <span className="text-[11px] text-ink-400">{j.date}</span>
                        </div>
                        <p className="text-xs text-ink-500 mt-0.5">{j.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
