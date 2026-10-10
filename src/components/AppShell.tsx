import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LayoutDashboard, Search, User, ListChecks, Info, Compass } from "lucide-react";

const NAV = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/opportunities", label: "Explore", icon: Search },
  { to: "/tracker", label: "Tracker", icon: ListChecks },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/about", label: "About", icon: Info },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background md:flex">
      <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 bg-sidebar text-sidebar-foreground p-5">
        <Brand />
        <nav className="mt-8 flex flex-col gap-1" aria-label="Main">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} activeOptions={{ exact: true }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent"
              activeProps={{ className: "bg-sidebar-primary !text-sidebar-primary-foreground" }}>
              <Icon className="h-4 w-4" aria-hidden /> {label}
            </Link>
          ))}
        </nav>
        <p className="mt-auto text-xs text-sidebar-foreground/60">All listings are sample data for demo purposes.</p>
      </aside>
      <header className="md:hidden sticky top-0 z-20 bg-sidebar text-sidebar-foreground px-4 py-3"><Brand /></header>
      <main className="flex-1 md:ml-60 pb-24 md:pb-10">
        <div className="mx-auto max-w-6xl px-4 py-5 md:px-8 md:py-8">{children}</div>
      </main>
      <nav aria-label="Main mobile" className="md:hidden fixed bottom-0 inset-x-0 z-20 border-t bg-card grid grid-cols-5">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} activeOptions={{ exact: true }}
            className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground"
            activeProps={{ className: "!text-accent" }}>
            <Icon className="h-5 w-5" aria-hidden /> {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"><Compass className="h-5 w-5" /></span>
      <span className="font-display text-lg font-bold">FinGuide <span className="text-sidebar-primary">AI</span></span>
    </Link>
  );
}
