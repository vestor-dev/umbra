import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { MAINNET_CHAIN_ID, SEPOLIA_CHAIN_ID, type SupportedChainId } from "@umbra/core";
import { PairsTable } from "@/components/pairs-table";
import { Reveal } from "@/components/reveal";
import { RefreshButton } from "@/components/refresh-button";
import { Spinner } from "@/components/spinner";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import { getPairsCached } from "@/lib/registry-data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Registry — Umbra",
  description: "Every ERC-20 ↔ ERC-7984 pair in the Zama Wrappers Registry, read live from chain.",
};

/** Segmented network switch — an ink pill glides under the active network. */
function NetworkSwitch({ isMainnet }: { isMainnet: boolean }) {
  const item = "relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors duration-200";
  return (
    <div className="inline-flex items-center rounded-full border border-hairline bg-surface p-1 shadow-soft">
      <Link
        href="/registry"
        aria-current={!isMainnet ? "true" : undefined}
        className={cn(item, !isMainnet ? "bg-ink text-surface shadow-pill" : "text-muted hover:text-ink")}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", !isMainnet ? "bg-[#7dd3a8]" : "bg-faint")} />
        Sepolia
      </Link>
      <Link
        href="/registry?chain=mainnet"
        aria-current={isMainnet ? "true" : undefined}
        className={cn(item, isMainnet ? "bg-ink text-surface shadow-pill" : "text-muted hover:text-ink")}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", isMainnet ? "bg-[#8fa2ff]" : "bg-faint")} />
        Ethereum
      </Link>
    </div>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="bg-surface px-5 py-4">
      <div className="font-mono text-2xl font-medium tracking-tight text-ink">{value}</div>
      <div className="label mt-1 text-faint">{label}</div>
    </div>
  );
}

export default async function RegistryPage({
  searchParams,
}: {
  searchParams: Promise<{ chain?: string }>;
}) {
  const { chain } = await searchParams;
  const isMainnet = chain === "mainnet" || chain === "1";
  const chainId: SupportedChainId = isMainnet ? MAINNET_CHAIN_ID : SEPOLIA_CHAIN_ID;
  const explorerBase = isMainnet ? "https://etherscan.io" : "https://sepolia.etherscan.io";

  const { pairs } = await getPairsCached(chainId);

  const official = pairs.filter((p) => p.badge === "official").length;
  const mock = pairs.filter((p) => p.badge === "mock").length;
  const verified = pairs.filter((p) => p.supports7984 && p.bidirectionalOk).length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:px-10">
      {/* Header */}
      <Reveal className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="label text-muted">Live registry</p>
          <div className="mt-3 flex items-center gap-3">
            <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
              Confidential wrappers
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-2.5 py-0.5 text-[11px] font-medium text-muted shadow-soft">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              Live
            </span>
          </div>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            Every ERC-20 ↔ ERC-7984 pair on {isMainnet ? "Ethereum mainnet" : "Sepolia"}, read live
            from chain.{" "}
            {isMainnet
              ? "Mainnet is read-only — wrap, unwrap, and decrypt run on Sepolia."
              : "Open any pair to faucet, wrap, send, reveal, and unwrap."}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <RefreshButton />
          <NetworkSwitch isMainnet={isMainnet} />
        </div>
      </Reveal>

      {/* Stats strip */}
      <Reveal
        delay={80}
        className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline shadow-soft sm:grid-cols-4"
      >
        <Stat value={pairs.length} label="Pairs" />
        <Stat value={official} label="Official" />
        <Stat value={mock} label="Testnet mocks" />
        <Stat value={`${verified}/${pairs.length || 0}`} label="Verified" />
      </Reveal>

      {/* Table + add pair */}
      <Reveal delay={140} className="mt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl text-ink">
            {isMainnet ? "Ethereum" : "Sepolia"} pairs
          </h2>
          <Link href="/add-pair" className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}>
            <Plus className="h-4 w-4" />
            Add a pair
          </Link>
        </div>

        {pairs.length === 0 ? (
          <div className="bg-grid flex flex-col items-center gap-4 rounded-2xl border border-hairline bg-surface/50 px-6 py-16 text-center shadow-soft">
            <div className="relative grid place-items-center">
              <div className="orb absolute h-14 w-14 opacity-60 blur-[2px]" aria-hidden />
              <Spinner size="lg" className="relative" />
            </div>
            <p className="text-sm font-medium text-ink">Reading the registry from chain…</p>
            <p className="max-w-xs text-xs text-muted">
              This loads on-chain in one multicall. Refresh in a moment if it doesn&apos;t appear.
            </p>
          </div>
        ) : (
          <PairsTable pairs={pairs} explorerBase={explorerBase} linkDetails={!isMainnet} />
        )}
      </Reveal>
    </div>
  );
}
