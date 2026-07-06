"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@/components/connect-button";
import { cn } from "@/components/ui/cn";

const NAV = [
  { href: "/registry", label: "Registry" },
  { href: "/activity", label: "Activity" },
  { href: "/decrypt", label: "Decrypt" },
  { href: "/developers", label: "Developers" },
];

export function Header() {
  const pathname = usePathname();
  // The embeddable widget renders chrome-free so other sites can iframe it.
  if (pathname?.startsWith("/embed")) return null;

  // Keep "Registry" lit while browsing an individual pair (it's part of that flow).
  const isActive = (href: string) =>
    href === "/registry"
      ? Boolean(pathname?.startsWith("/registry") || pathname?.startsWith("/pair"))
      : Boolean(pathname?.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/75 backdrop-blur-xl">
      <div className="relative flex h-14 items-center justify-between px-5 lg:px-8">
        {/* Left edge: eclipse mark + serif wordmark */}
        <Link href="/" className="group flex items-center gap-2.5">
          <Image
            src="/umbra-mark.svg"
            alt="Umbra"
            width={26}
            height={26}
            className="h-[26px] w-[26px] transition-transform duration-500 ease-out group-hover:rotate-[18deg]"
            priority
          />
          <span className="font-display text-[19px] font-semibold leading-none tracking-tight text-ink">
            Umbra
          </span>
        </Link>

        {/* Center: navigation */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 text-sm md:flex">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3 py-1.5 font-medium transition-colors duration-150",
                  active
                    ? "text-ink"
                    : "text-muted hover:bg-ink/[0.04] hover:text-ink",
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-[7px] h-px bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right edge: wallet */}
        <ConnectButton />
      </div>
    </header>
  );
}
