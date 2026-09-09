import { NavLink } from "react-router-dom";
import { LayoutGrid, Mic, Network, ShieldCheck, MessageCircleHeart, PackageSearch, Sparkles, Sun } from "lucide-react";
import clsx from "clsx";

const nav = [
  { to: "/", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/voice", label: "Voice Doc", icon: Mic },
  { to: "/graph", label: "Graph", icon: Network },
  { to: "/compliance", label: "Compliance", icon: ShieldCheck },
  { to: "/predictive", label: "Predictive", icon: Sparkles },
  { to: "/family", label: "Family", icon: MessageCircleHeart },
  { to: "/operations", label: "Operations", icon: PackageSearch },
];

export default function MobileNav() {
  return (
    <div className="md:hidden sticky top-0 z-30 bg-cream-50/95 backdrop-blur border-b border-ink-100">
      <div className="flex items-center gap-2 px-4 h-14">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-moss-600 text-white shrink-0">
          <Sun size={15} strokeWidth={2.25} />
        </div>
        <div className="font-display text-base text-ink-900 shrink-0 mr-1">Lumen</div>
      </div>
      <div className="flex gap-1 overflow-x-auto px-3 pb-2.5 scrollbar-thin">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium shrink-0",
                isActive ? "bg-moss-600 text-white" : "bg-ink-100 text-ink-600"
              )
            }
          >
            <item.icon size={13} />
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
