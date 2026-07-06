"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";

/**
 * The signature Umbra moment: a confidential balance that lives redacted in
 * shadow until *you* reveal it. Purely illustrative on the landing page, but it
 * mirrors the real EIP-712 user-decrypt flow used across the app.
 */
export function HeroReveal() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="w-full max-w-[20rem] rounded-2xl border border-hairline bg-surface/90 p-4 shadow-[0_1px_2px_rgba(21,22,34,0.05),0_30px_60px_-30px_rgba(21,22,34,0.5)] backdrop-blur-md">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">Your confidential balance</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
          <Lock className="h-3 w-3" /> encrypted
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0 font-mono text-[1.7rem] font-semibold leading-none">
          {revealed ? (
            <span className="animate-reveal text-success">8,420.00</span>
          ) : (
            <span className="select-none tracking-[0.12em] text-ink/80" aria-hidden>
              ••••••
            </span>
          )}{" "}
          <span className="text-sm font-normal text-muted">cUSDC</span>
        </div>
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-accent px-3.5 text-xs font-medium text-accent-fg transition-[background-color,transform] duration-150 hover:bg-accent-hover active:translate-y-px"
        >
          {revealed ? (
            <>
              <EyeOff className="h-3.5 w-3.5" /> Hide
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" /> Reveal
            </>
          )}
        </button>
      </div>

      <div className="mt-3.5 flex items-center gap-2 border-t border-hairline pt-3 text-xs text-muted">
        <ShieldCheck className="h-3.5 w-3.5 text-success" />
        {revealed ? "Decrypted locally — the chain never saw it." : "Only you can reveal it, via EIP-712."}
      </div>
    </div>
  );
}
