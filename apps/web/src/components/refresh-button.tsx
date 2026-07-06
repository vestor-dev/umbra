"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Refreshes the current view in place — re-runs the route's server data
 * (router.refresh) AND invalidates wagmi/react-query reads (balances, logs), so
 * a wrap/unwrap/send is reflected without a full-page reload.
 */
export function RefreshButton({
  className,
  iconOnly = false,
}: {
  className?: string;
  iconOnly?: boolean;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    if (busy) return;
    setBusy(true);
    router.refresh();
    try {
      await queryClient.invalidateQueries();
    } finally {
      // keep the spin visible for at least a beat so it reads as an action
      setTimeout(() => setBusy(false), 500);
    }
  };

  return (
    <button
      type="button"
      onClick={refresh}
      disabled={busy}
      aria-label="Refresh data"
      title="Refresh balances & data"
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full border border-hairline bg-surface font-medium text-ink-soft shadow-soft transition-colors duration-150 hover:bg-surface-2 disabled:opacity-70",
        iconOnly ? "w-9 justify-center" : "px-3.5 text-xs",
        className,
      )}
    >
      <RefreshCw className={cn("h-3.5 w-3.5", busy && "animate-spin")} />
      {!iconOnly && (busy ? "Refreshing…" : "Refresh")}
    </button>
  );
}
