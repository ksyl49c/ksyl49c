import { Link } from "react-router-dom";
import { Mic, Network, ShieldCheck, MessageCircleHeart, PackageSearch, Sparkles, ArrowUpRight, AlertTriangle, ShieldAlert } from "lucide-react";
import { Card, Badge, StatTile, Avatar } from "../components/ui/Primitives";
import { individuals, staff, incidents, auditItems, supportThreads, individualById } from "../lib/mockData";

const overdue = auditItems.filter((a) => a.status !== "met").length;
const highEscalation = individuals.filter((p) => p.escalationRisk >= 55);
const overloaded = staff.filter((s) => s.status === "overloaded");
const openIncidents = incidents.filter((i) => i.status !== "closed");
const draftsReady = supportThreads.filter((f) => f.status === "draft-ready").length;

const modules = [
  { to: "/voice", icon: Mic, label: "Voice Documentation", stat: "3 captures today", tone: "moss" as const },
  { to: "/graph", icon: Network, label: "Resident Graph", stat: `${highEscalation.length} elevated escalation risk`, tone: "clay" as const },
  { to: "/compliance", icon: ShieldCheck, label: "Compliance & Audit", stat: `${overdue} items need attention`, tone: "amber" as const },
  { to: "/predictive", icon: Sparkles, label: "Predictive Intelligence", stat: "1 possible diagnostic overshadowing flag", tone: "rose" as const },
  { to: "/family", icon: MessageCircleHeart, label: "Family & Communication", stat: `${draftsReady} drafts ready to send`, tone: "sky" as const },
  { to: "/operations", icon: PackageSearch, label: "Operations", stat: "3 critical supply items", tone: "clay" as const },
];

export default function Overview() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-wider text-moss-600 mb-1.5">
          Wednesday, September 9 &middot; Day shift
        </div>
        <h1 className="font-display text-[32px] leading-tight text-ink-900">{greeting}, Kate</h1>
        <p className="text-ink-500 mt-1.5 max-w-2xl text-[15px]">
          4 homes &amp; day services &mdash; {individuals.length} people supported, {staff.length + 14} staff on roster this week.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatTile label="Elevated escalation risk" value={String(highEscalation.length)} sub="behavioural risk ≥ 55/100" tone={highEscalation.length ? "rose" : "moss"} />
        <StatTile label="Staff overloaded" value={String(overloaded.length)} sub="burnout signal elevated" tone={overloaded.length ? "clay" : "moss"} />
        <StatTile label="Open safety events" value={String(openIncidents.length)} sub="restrictive practice, safeguarding" tone="amber" />
        <StatTile label="Compliance items" value={String(overdue)} sub="at-risk or gap this cycle" tone="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card padded={false}>
            <div className="p-5 pb-3 flex items-center justify-between">
              <h2 className="font-display text-lg text-ink-900">Needs attention now</h2>
              <Badge tone="rose">{highEscalation.length + overloaded.length + openIncidents.length} active</Badge>
            </div>
            <div className="divide-y divide-ink-100">
              {highEscalation.map((p) => (
                <AlertRow
                  key={p.id}
                  icon={<AlertTriangle size={16} />}
                  tone="rose"
                  title={`${p.name} — escalation risk ${p.escalationRisk}/100`}
                  detail={`${p.home} · keyworker ${p.keyworker}`}
                  meta={p.service}
                  to="/graph"
                />
              ))}
              {overloaded.map((s) => (
                <AlertRow
                  key={s.id}
                  icon={<ShieldAlert size={16} />}
                  tone="clay"
                  title={`${s.name} — burnout signal elevated`}
                  detail={`Task load ${s.taskLoad}%, ${s.hoursOnShift.toFixed(1)}h on shift, ${s.assignedRatio} support`}
                  meta={s.home}
                  to="/operations"
                />
              ))}
              {openIncidents.slice(0, 2).map((i) => (
                <AlertRow
                  key={i.id}
                  icon={<AlertTriangle size={16} />}
                  tone="amber"
                  title={`${i.type} — ${individualById(i.individualId)?.name ?? "Individual"}`}
                  detail={i.summary}
                  meta={i.timestamp}
                  to="/voice"
                />
              ))}
            </div>
          </Card>

          <Card padded={false}>
            <div className="p-5 pb-3">
              <h2 className="font-display text-lg text-ink-900">Modules</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 p-5 pt-1">
              {modules.map((m) => (
                <Link
                  key={m.to}
                  to={m.to}
                  className="group flex items-start gap-3 rounded-xl border border-ink-100 p-4 hover:border-moss-300 hover:bg-moss-50/50 transition-colors"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-600 group-hover:bg-moss-600 group-hover:text-white transition-colors">
                    <m.icon size={17} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-semibold text-ink-800 flex items-center gap-1">
                      {m.label}
                      <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity text-moss-600" />
                    </div>
                    <div className="text-xs text-ink-500 mt-0.5">{m.stat}</div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <h2 className="font-display text-lg text-ink-900 mb-4">On shift now</h2>
            <div className="space-y-3">
              {staff.slice(0, 6).map((s) => (
                <div key={s.id} className="flex items-center gap-3">
                  <Avatar initials={s.name.split(" ").map((n) => n[0]).join("")} size={32} tone={s.status === "overloaded" ? "clay" : "moss"} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-ink-800 truncate">{s.name}</div>
                    <div className="text-xs text-ink-400">{s.role} &middot; {s.home}</div>
                  </div>
                  <Badge tone={s.status === "overloaded" ? "clay" : s.status === "available" ? "moss" : "ink"} className="capitalize shrink-0">
                    {s.status.replace("-", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-moss-800 border-moss-800 text-cream-100">
            <div className="text-xs font-semibold uppercase tracking-wider text-moss-200 mb-1.5">Weekly snapshot</div>
            <div className="font-display text-2xl mb-3">Restrictive practice trending down</div>
            <p className="text-[13.5px] text-moss-100 leading-relaxed mb-4">
              Restrictive practice incidents down 18% week-over-week. One possible diagnostic-overshadowing
              flag raised this morning &mdash; care team notified for GP review.
            </p>
            <Link to="/predictive" className="inline-flex items-center gap-1 text-[13px] font-semibold text-white hover:underline">
              View predictive intelligence <ArrowUpRight size={14} />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AlertRow({
  icon,
  tone,
  title,
  detail,
  meta,
  to,
}: {
  icon: React.ReactNode;
  tone: "rose" | "clay" | "amber";
  title: string;
  detail?: string;
  meta: string;
  to: string;
}) {
  const toneMap = { rose: "bg-rose-100 text-rose-600", clay: "bg-clay-100 text-clay-700", amber: "bg-amber-100 text-amber-600" };
  return (
    <Link to={to} className="flex items-start gap-3 px-5 py-3.5 hover:bg-ink-50/70 transition-colors">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toneMap[tone]}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-semibold text-ink-800">{title}</div>
        {detail && <div className="text-xs text-ink-500 mt-0.5 line-clamp-1">{detail}</div>}
        <div className="text-[11px] text-ink-400 mt-1">{meta}</div>
      </div>
    </Link>
  );
}
