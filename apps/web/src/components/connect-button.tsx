"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";
import { LogOut, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";

function short(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function ConnectButton() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Escape closes the confirm dialog.
  useEffect(() => {
    if (!confirmOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setConfirmOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [confirmOpen]);

  // Privy is still booting.
  if (!ready) {
    return (
      <Button variant="secondary" disabled className="opacity-70">
        <Spinner size="sm" />
        Loading…
      </Button>
    );
  }

  // Not signed in — Privy's modal offers every EVM wallet (+ email).
  if (!authenticated) {
    return (
      <Button onClick={login}>
        <Wallet className="h-4 w-4" />
        Connect wallet
      </Button>
    );
  }

  const addr = address ?? (user?.wallet?.address as string | undefined);
  // Only flag the network once we actually have an on-chain wallet connected.
  const wrongNetwork = Boolean(address) && chainId !== sepolia.id;
  const avatarHue = addr ? parseInt(addr.slice(2, 8), 16) % 360 : 210;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {wrongNetwork ? (
        <Button variant="warn" size="sm" onClick={() => switchChain({ chainId: sepolia.id })}>
          <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
          Switch to Sepolia
        </Button>
      ) : address ? (
        <span className="hidden h-9 items-center gap-1.5 rounded-full border border-hairline bg-surface px-3 text-xs font-medium text-ink-soft shadow-soft sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_0] shadow-success/60" />
          Sepolia
        </span>
      ) : null}

      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        title="Wallet options"
        className="group inline-flex h-9 items-center gap-2 rounded-full border border-hairline bg-surface pl-1.5 pr-3 text-sm font-medium text-ink-soft shadow-soft transition-colors duration-150 hover:bg-surface-2"
      >
        <span
          className="h-5 w-5 rounded-full"
          style={{ backgroundColor: `hsl(${avatarHue} 58% 45%)` }}
          aria-hidden
        />
        <span className="font-mono text-xs">{addr ? short(addr) : "Connected"}</span>
        <LogOut className="h-3.5 w-3.5 text-faint transition-colors duration-150 group-hover:text-ink" />
      </button>

      {confirmOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Disconnect wallet"
          >
            <div
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
              onClick={() => setConfirmOpen(false)}
            />
            <div className="animate-fade-up relative w-full max-w-xs rounded-2xl border border-hairline bg-elevated p-6 text-center shadow-float">
              <span
                className="mx-auto grid h-12 w-12 place-items-center rounded-full ring-4 ring-canvas"
                style={{ backgroundColor: `hsl(${avatarHue} 58% 45%)` }}
                aria-hidden
              >
                <Wallet className="h-5 w-5 text-white" />
              </span>
              <h2 className="font-display mt-4 text-lg text-ink">Disconnect wallet?</h2>
              {addr && <p className="mt-1 font-mono text-xs text-muted">{short(addr)}</p>}
              <p className="mt-2 text-xs leading-relaxed text-muted">
                You&apos;ll need to reconnect to wrap, unwrap, or reveal balances again.
              </p>
              <div className="mt-5 flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setConfirmOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-danger text-white shadow-pill hover:bg-danger hover:brightness-105"
                  onClick={() => {
                    setConfirmOpen(false);
                    logout();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Disconnect
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
