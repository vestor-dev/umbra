"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Re-fetches the current route's server data via router.refresh() — updates the
 * registry in place, no full-page reload, no scroll jump.
 */
export function RefreshButton({ className }: { className?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.refresh())}
      disabled={pending}
      aria-label="Refresh data"
      title="Refresh data"
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full border border-hairline bg-surface px-3.5 text-xs font-medium text-ink-soft shadow-soft transition-colors duration-150 hover:bg-surface-2 disabled:opacity-60",
        className,
      )}
    >
      <RefreshCw className={cn("h-3.5 w-3.5 transition-transform", pending && "animate-spin")} />
      {pending ? "Refreshing…" : "Refresh"}
    </button>
  );
}
