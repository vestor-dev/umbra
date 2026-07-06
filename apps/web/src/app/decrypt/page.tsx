"use client";

import { useState } from "react";
import { CheckCircle2, Eye } from "lucide-react";
import { getAddress, isAddress } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { ERC7984_INTERFACE_ID, erc7984Abi } from "@umbra/core";
import { DecryptBalance, type DecryptToken } from "@/components/decrypt-balance";
import { ConnectButton } from "@/components/connect-button";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DecryptPage() {
  const [input, setInput] = useState("");
  const [token, setToken] = useState<DecryptToken | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const { isConnected } = useAccount();
  const client = usePublicClient();

  async function check() {
    setError(null);
    setToken(null);
    const addr = input.trim();
    if (!isAddress(addr)) {
      setError("Enter a valid contract address (0x…).");
      return;
    }
    if (!client) {
      setError("No RPC client available — connect your wallet.");
      return;
    }
    setChecking(true);
    try {
      const address = getAddress(addr);
      const supports = await client
        .readContract({
          address,
          abi: erc7984Abi,
          functionName: "supportsInterface",
          args: [ERC7984_INTERFACE_ID],
        })
        .catch(() => false);
      if (supports !== true) {
        setError("That address doesn't implement the ERC-7984 confidential-token interface.");
        return;
      }
      const [symbol, decimals] = await Promise.all([
        client.readContract({ address, abi: erc7984Abi, functionName: "symbol" }).catch(() => undefined),
        client.readContract({ address, abi: erc7984Abi, functionName: "decimals" }).catch(() => undefined),
      ]);
      setToken({
        address,
        symbol: symbol as string | undefined,
        decimals: decimals as number | undefined,
      });
    } catch (e) {
      setError((e as Error).message.split("\n")[0] ?? "Failed to read the token.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12 lg:py-16">
      <div className="animate-fade-up">
        <p className="label text-muted">Universal decryptor</p>
        <h1 className="font-display mt-4 text-4xl tracking-tight text-ink sm:text-5xl">
          Decrypt any ERC-7984 token
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Paste any confidential token address to privately decrypt your own balance — even tokens
          that aren’t in the registry. Validated on-chain via ERC-165.
        </p>
      </div>

      <div className="animate-fade-up mt-8 rounded-2xl border border-hairline bg-surface p-5 shadow-soft" style={{ animationDelay: "0.1s" }}>
        <label htmlFor="token-addr" className="text-xs font-medium text-muted">
          Confidential token address
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Input
            id="token-addr"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && check()}
            placeholder="0x… ERC-7984 token address"
            className="font-mono"
            spellCheck={false}
            autoComplete="off"
          />
          <Button onClick={check} disabled={checking} className="sm:w-auto">
            {checking ? <Spinner size="sm" /> : <Eye className="h-4 w-4" />}
            {checking ? "Checking…" : "Check token"}
          </Button>
        </div>
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        {!isConnected && !error && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline bg-surface-2 px-4 py-3">
            <p className="text-sm text-muted">Connect your wallet to decrypt your balance.</p>
            <ConnectButton />
          </div>
        )}
      </div>

      {token && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <CheckCircle2 className="h-4 w-4 text-success" />
            ERC-7984 verified — {token.symbol ?? "Confidential token"}
            <span className="text-muted">· {token.decimals ?? 6} decimals</span>
          </div>
          <DecryptBalance token={token} />
        </div>
      )}
    </main>
  );
}
