"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";
import { Check, Copy, ExternalLink, LogOut, Wallet } from "lucide-react";
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
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Escape closes the account dialog; reset the "copied" flash when it opens.
  useEffect(() => {
    if (!open) return;
    setCopied(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

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

  const copyAddress = async () => {
    if (!addr) return;
    try {
      await navigator.clipboard.writeText(addr);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

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
        onClick={() => setOpen(true)}
        title="Wallet"
        className="group inline-flex h-9 items-center gap-2 rounded-full border border-hairline bg-surface pl-1.5 pr-3 text-sm font-medium text-ink-soft shadow-soft transition-colors duration-150 hover:bg-surface-2"
      >
        <span
          className="h-5 w-5 rounded-full"
          style={{ backgroundColor: `hsl(${avatarHue} 58% 45%)` }}
          aria-hidden
        />
        <span className="font-mono text-xs">{addr ? short(addr) : "Connected"}</span>
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Wallet"
          >
            <div
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <div className="animate-fade-up relative w-full max-w-sm rounded-2xl border border-hairline bg-elevated p-6 text-center shadow-float">
              <span
                className="mx-auto grid h-14 w-14 place-items-center rounded-full ring-4 ring-canvas"
                style={{ backgroundColor: `hsl(${avatarHue} 58% 45%)` }}
                aria-hidden
              >
                <Wallet className="h-6 w-6 text-white" />
              </span>
              <h2 className="font-display mt-4 text-lg text-ink">Your wallet</h2>
              {addr && (
                <p className="mx-auto mt-1 max-w-[16rem] break-all font-mono text-xs text-muted">
                  {addr}
                </p>
              )}

              <div className="mt-5 grid gap-2">
                <button
                  type="button"
                  onClick={copyAddress}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-hairline bg-surface text-sm font-medium text-ink shadow-soft transition-colors hover:bg-surface-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-success" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy address
                    </>
                  )}
                </button>
                {addr && (
                  <a
                    href={`https://sepolia.etherscan.io/address/${addr}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-hairline bg-surface text-sm font-medium text-ink shadow-soft transition-colors hover:bg-surface-2"
                  >
                    <ExternalLink className="h-4 w-4" /> View on Etherscan
                  </a>
                )}
              </div>

              <div className="mt-4 flex gap-2 border-t border-hairline pt-4">
                <Button variant="secondary" className="flex-1" onClick={() => setOpen(false)}>
                  Close
                </Button>
                <Button
                  className="flex-1 bg-danger text-white shadow-pill hover:bg-danger hover:brightness-105"
                  onClick={() => {
                    setOpen(false);
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
