"use client";

import { Wallet } from "lucide-react";
import type { ReactNode } from "react";
import { ConnectButton } from "@/components/connect-button";

/**
 * A gate shown when a wallet is required — states what's behind it and puts the
 * Connect button right where the user needs it (not just in the sidebar).
 */
export function ConnectCard({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl border border-hairline bg-surface px-6 py-12 text-center shadow-soft">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-ink">
        <Wallet className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-medium text-ink">{title}</p>
        {children && <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-muted">{children}</p>}
      </div>
      <ConnectButton />
    </div>
  );
}
