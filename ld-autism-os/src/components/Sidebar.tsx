import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Mic,
  Network,
  ShieldCheck,
  MessageCircleHeart,
  PackageSearch,
  Sparkles,
  Sun,
} from "lucide-react";
import clsx from "clsx";
import { Avatar } from "./ui/Primitives";

const nav = [
  { to: "/", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/voice", label: "Voice Documentation", icon: Mic },
  { to: "/graph", label: "Resident Graph", icon: Network },
  { to: "/compliance", label: "Compliance & Audit", icon: ShieldCheck },
  { to: "/predictive", label: "Predictive Intelligence", icon: Sparkles },
  { to: "/family", label: "Family & Communication", icon: MessageCircleHeart },
  { to: "/operations", label: "Operations", icon: PackageSearch },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-[248px] shrink-0 flex-col border-r border-ink-100 bg-cream-50/60 h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-5 h-16 shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-moss-600 text-white">
          <Sun size={17} strokeWidth={2.25} />
        </div>
        <div className="font-display text-lg text-ink-900 tracking-tight">Lumen</div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 px-3 mt-3 mb-2">
          Care & Support
        </div>
        <ul className="space-y-0.5">
          {nav.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  clsx(
                    "group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors",
                    isActive
                      ? "bg-moss-600 text-white shadow-[var(--shadow-soft)]"
                      : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={17} strokeWidth={2} className={isActive ? "text-white" : "text-ink-400 group-hover:text-ink-600"} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-4 pb-3 pt-2">
        <p className="text-[10.5px] leading-relaxed text-ink-400">
          Designed with reduced motion, calm colour and plain language throughout,
          in line with sensory-friendly practice.
        </p>
      </div>

      <div className="p-3 border-t border-ink-100">
        <div className="flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 hover:bg-ink-100 transition-colors cursor-pointer">
          <Avatar initials="KL" size={34} tone="clay" />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-ink-800 truncate">Kate Lau</div>
            <div className="text-xs text-ink-400 truncate">Registered Manager</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
