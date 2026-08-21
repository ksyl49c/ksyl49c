import type { ReactNode } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function Card({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={twMerge(
        clsx(
          "rounded-2xl border border-ink-100 bg-white shadow-[var(--shadow-card)]",
          padded && "p-5"
        ),
        className
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        {eyebrow && (
          <div className="text-xs font-semibold uppercase tracking-wider text-moss-600 mb-1.5">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-[28px] leading-tight text-ink-900">{title}</h1>
        {description && <p className="text-ink-500 mt-1.5 max-w-2xl text-[15px]">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

const badgeTones = {
  moss: "bg-moss-100 text-moss-700",
  clay: "bg-clay-100 text-clay-700",
  amber: "bg-amber-100 text-amber-600",
  rose: "bg-rose-100 text-rose-600",
  sky: "bg-sky-100 text-sky-600",
  ink: "bg-ink-100 text-ink-600",
};

export function Badge({
  children,
  tone = "ink",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof badgeTones;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        badgeTones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Dot({ tone = "ink" }: { tone?: keyof typeof badgeTones }) {
  const map: Record<string, string> = {
    moss: "bg-moss-500",
    clay: "bg-clay-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    sky: "bg-sky-500",
    ink: "bg-ink-400",
  };
  return <span className={clsx("h-1.5 w-1.5 rounded-full", map[tone])} />;
}

export function StatTile({
  label,
  value,
  sub,
  tone = "ink",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: keyof typeof badgeTones;
}) {
  const map: Record<string, string> = {
    moss: "text-moss-600",
    clay: "text-clay-600",
    amber: "text-amber-600",
    rose: "text-rose-600",
    sky: "text-sky-600",
    ink: "text-ink-800",
  };
  return (
    <Card className="min-w-[150px]">
      <div className="text-xs font-medium uppercase tracking-wide text-ink-400 mb-2">{label}</div>
      <div className={clsx("font-display text-3xl", map[tone])}>{value}</div>
      {sub && <div className="text-xs text-ink-500 mt-1.5">{sub}</div>}
    </Card>
  );
}

export function ProgressBar({ value, tone = "moss" }: { value: number; tone?: keyof typeof badgeTones }) {
  const map: Record<string, string> = {
    moss: "bg-moss-500",
    clay: "bg-clay-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    sky: "bg-sky-500",
    ink: "bg-ink-500",
  };
  return (
    <div className="h-1.5 w-full rounded-full bg-ink-100 overflow-hidden">
      <div className={clsx("h-full rounded-full transition-all", map[tone])} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function IconButton({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "inline-flex items-center justify-center rounded-full h-9 w-9 text-ink-500 hover:bg-ink-100 hover:text-ink-800 transition-colors",
        className
      )}
    >
      {children}
    </button>
  );
}

export function Avatar({ initials, size = 36, tone = "moss" }: { initials: string; size?: number; tone?: keyof typeof badgeTones }) {
  const map: Record<string, string> = {
    moss: "bg-moss-500",
    clay: "bg-clay-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    sky: "bg-sky-500",
    ink: "bg-ink-600",
  };
  return (
    <div
      className={clsx("flex items-center justify-center rounded-full text-white font-semibold shrink-0", map[tone])}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}
