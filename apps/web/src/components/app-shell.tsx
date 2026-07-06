"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Activity,
  Code2,
  Eye,
  FileJson2,
  Layers,
  Menu,
  Plus,
  X,
} from "lucide-react";
import { ConnectButton } from "@/components/connect-button";
import { cn } from "@/components/ui/cn";

const NAV = [
  { href: "/registry", label: "Wrappers", icon: Layers, match: ["/registry", "/pair"] },
  { href: "/decrypt", label: "Reveal", icon: Eye, match: ["/decrypt"] },
  { href: "/activity", label: "Ledger", icon: Activity, match: ["/activity"] },
  { href: "/developers", label: "Build", icon: Code2, match: ["/developers"] },
];

const SECONDARY = [
  { href: "/add-pair", label: "Add a pair", icon: Plus },
  { href: "/api/token-list", label: "Token list", icon: FileJson2, external: true },
];

function Brand() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <Image
        src="/umbra-mark.svg"
        alt="Umbra"
        width={28}
        height={28}
        className="h-7 w-7 transition-transform duration-500 ease-out group-hover:rotate-[20deg]"
        priority
      />
      <span className="font-display text-2xl leading-none tracking-tight text-ink">Umbra</span>
    </Link>
  );
}

function SidebarBody({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  const active = (m: string[]) => m.some((p) => pathname === p || pathname.startsWith(p + "/") || pathname === p);
  return (
    <div className="flex h-full flex-col">
      <div className="px-6 pt-6 pb-8">
        <Brand />
      </div>

      <nav className="flex-1 px-4">
        <p className="label px-3 pb-3 text-faint">Workstation</p>
        <ul className="space-y-1">
          {NAV.map((item) => {
            const on = active(item.match);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.9rem] font-medium transition-colors duration-150",
                    on
                      ? "bg-ink text-surface"
                      : "text-ink-soft hover:bg-ink/[0.05] hover:text-ink",
                  )}
                >
                  {/* iridescent tick on the active item */}
                  {on && (
                    <span className="iri absolute left-1 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full" />
                  )}
                  <Icon className={cn("h-[18px] w-[18px]", on ? "text-surface" : "text-faint group-hover:text-ink")} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="label px-3 pb-3 pt-8 text-faint">More</p>
        <ul className="space-y-1">
          {SECONDARY.map((item) => {
            const Icon = item.icon;
            const cls =
              "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted transition-colors duration-150 hover:bg-ink/[0.05] hover:text-ink";
            return (
              <li key={item.href}>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className={cls}>
                    <Icon className="h-[18px] w-[18px] text-faint group-hover:text-ink" />
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href} onClick={onNavigate} className={cls}>
                    <Icon className="h-[18px] w-[18px] text-faint group-hover:text-ink" />
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Wallet + meta docked at the bottom */}
      <div className="mt-auto space-y-4 border-t border-hairline px-5 py-5">
        <ConnectButton />
        <p className="text-xs leading-relaxed text-faint">
          Confidential value, revealed only to you.
          <br />
          <span className="font-mono">@umbra/core</span> · Zama FHE
        </p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);

  // Close the mobile drawer on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // The embeddable widget renders fully chrome-free.
  if (pathname.startsWith("/embed")) return <>{children}</>;

  return (
    <div className="min-h-dvh">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-hairline bg-canvas/85 px-4 backdrop-blur-xl lg:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="grid h-9 w-9 place-items-center rounded-lg text-ink transition-colors hover:bg-ink/[0.06]"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Backdrop for mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar — fixed rail on desktop, off-canvas drawer on mobile */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-hairline bg-surface/80 backdrop-blur-xl transition-transform duration-300 ease-out lg:w-64 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* mobile close */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="absolute right-3 top-4 grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-ink/[0.06] hover:text-ink lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
        <SidebarBody pathname={pathname} onNavigate={() => setOpen(false)} />
      </aside>

      {/* Main column */}
      <div className="lg:pl-64">
        <main className="min-h-[calc(100dvh-3.5rem)] lg:min-h-dvh">{children}</main>
        <footer className="border-t border-hairline px-6 py-6 lg:pl-8">
          <div className="flex flex-col gap-2 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
            <span>
              <span className="font-display text-sm text-ink">Umbra</span> — built for the Zama
              Developer Program.
            </span>
            <span className="font-mono">ERC-7984 · Sepolia + Ethereum</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
