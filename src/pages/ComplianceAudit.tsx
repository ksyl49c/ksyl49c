import { CheckCircle2, AlertCircle, XCircle, FileCheck, CalendarClock } from "lucide-react";
import clsx from "clsx";
import { Card, Badge, SectionHeading, StatTile } from "../components/ui/Primitives";
import { auditItems, incidents } from "../lib/mockData";

const statusMeta = {
  met: { label: "Met", tone: "moss" as const, icon: CheckCircle2 },
  "at-risk": { label: "At risk", tone: "amber" as const, icon: AlertCircle },
  gap: { label: "Gap", tone: "rose" as const, icon: XCircle },
};

const upcomingAudits = [
  { name: "State Annual Survey", date: "Sep 14, 2026", readiness: 82 },
  { name: "Fire & Life Safety Inspection", date: "Sep 2, 2026", readiness: 94 },
  { name: "Internal Quality Assurance Review", date: "Aug 28, 2026", readiness: 76 },
];

export default function ComplianceAudit() {
  const met = auditItems.filter((a) => a.status === "met").length;
  const score = Math.round((met / auditItems.length) * 100);
  const gaps = auditItems.filter((a) => a.status === "gap");
  const missingHuddle = incidents.filter((i) => i.type === "Fall");

  return (
    <div className="animate-fade-in-up">
      <SectionHeading
        eyebrow="Compliance & Audit"
        title="Always inspection-ready"
        description="Every voice-captured note, incident, and care plan update feeds a live compliance ledger — so nothing is reconstructed the night before a survey."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatTile label="Compliance score" value={`${score}%`} sub={`${met} of ${auditItems.length} requirements met`} tone={score > 85 ? "moss" : "amber"} />
        <StatTile label="Gaps" value={String(gaps.length)} sub="need immediate action" tone="rose" />
        <StatTile label="At risk" value={String(auditItems.filter((a) => a.status === "at-risk").length)} sub="trending toward gap" tone="amber" />
        <StatTile label="Next survey" value="24 days" sub="State Annual Survey" tone="sky" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        <Card padded={false}>
          <div className="p-5 pb-3 flex items-center justify-between">
            <h2 className="font-display text-lg text-ink-900">Regulatory requirements</h2>
            <Badge tone="ink">
              <FileCheck size={12} /> Auto-tracked
            </Badge>
          </div>
          <div className="divide-y divide-ink-100">
            {auditItems.map((a) => {
              const meta = statusMeta[a.status];
              const Icon = meta.icon;
              return (
                <div key={a.id} className="flex items-start gap-3 px-5 py-4">
                  <div
                    className={clsx(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      a.status === "met" ? "bg-moss-100 text-moss-700" : a.status === "at-risk" ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"
                    )}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{a.domain}</div>
                      <Badge tone={meta.tone} className="shrink-0">{meta.label}</Badge>
                    </div>
                    <div className="text-[13.5px] font-semibold text-ink-800 mt-0.5">{a.requirement}</div>
                    <div className="text-xs text-ink-500 mt-1">{a.lastEvidence}</div>
                    <div className="text-[11px] text-ink-400 mt-1">Owner: {a.owner}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <h2 className="font-display text-base text-ink-900 mb-3 flex items-center gap-2">
              <CalendarClock size={16} className="text-sky-600" /> Upcoming audits
            </h2>
            <div className="space-y-3">
              {upcomingAudits.map((a) => (
                <div key={a.name}>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-medium text-ink-800">{a.name}</span>
                    <span className="text-ink-400 text-xs">{a.date}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-ink-100 overflow-hidden mt-1.5">
                    <div
                      className={clsx("h-full rounded-full", a.readiness > 85 ? "bg-moss-500" : "bg-amber-500")}
                      style={{ width: `${a.readiness}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-ink-400 mt-1">{a.readiness}% readiness</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-rose-50 border-rose-200">
            <h2 className="text-[13.5px] font-semibold text-rose-700 mb-2">Evidence gap detected</h2>
            <p className="text-xs text-rose-700/80 leading-relaxed">
              {missingHuddle.length} fall incident(s) this week — post-fall huddle record missing for 1. Voice-captured fall
              reports auto-check for huddle completion within 24h.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
