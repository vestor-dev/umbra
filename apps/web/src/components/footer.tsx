"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  // The embeddable widget renders chrome-free.
  if (pathname?.startsWith("/embed")) return null;

  return (
    <footer className="mt-16 border-t border-hairline">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-9 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-display font-semibold text-ink">Umbra</span> — confidential value,
          revealed only to you.
        </p>
        <div className="flex items-center gap-5">
          <a
            href="/api/token-list"
            target="_blank"
            rel="noreferrer"
            className="transition-colors duration-150 hover:text-ink"
          >
            Token list ↗
          </a>
          <Link href="/developers" className="transition-colors duration-150 hover:text-ink">
            Developers
          </Link>
          <span className="font-mono text-xs text-faint">@umbra/core</span>
        </div>
      </div>
    </footer>
  );
}
