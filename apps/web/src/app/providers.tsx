"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { PrivyProvider, useWallets } from "@privy-io/react-auth";
import { WagmiProvider, useSetActiveWallet } from "@privy-io/wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { wagmiConfig } from "@/lib/wagmi";

// The Privy app id is a PUBLIC client id (it ships in the browser bundle), so a
// hardcoded fallback is safe — and it keeps the build from failing when the env
// var isn't set (CI, or a fresh Vercel project). Override it via env anytime.
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmrb1gi9b000r0cjly6tupaz7";

/**
 * Bridges Privy's connected wallet into wagmi. Without this, Privy can be
 * `authenticated` while wagmi's `useAccount()` still reports disconnected — so
 * every action gated on wagmi (wrap/unwrap/reveal) stays locked. We promote the
 * first external (non-embedded) wallet to wagmi's active wallet.
 */
function WalletBridge({ children }: { children: ReactNode }) {
  const { wallets } = useWallets();
  const { setActiveWallet } = useSetActiveWallet();

  useEffect(() => {
    if (!wallets.length) return;
    const external = wallets.find((w) => w.walletClientType !== "privy") ?? wallets[0];
    if (external) void setActiveWallet(external).catch(() => {});
  }, [wallets, setActiveWallet]);

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 2, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#0d0d10",
          walletChainType: "ethereum-only",
          logo: "/umbra-logo.svg",
        },
        loginMethods: ["wallet", "email"],
        // Email/social users have no external wallet — give them an embedded
        // Ethereum wallet so they get a real address to wrap/reveal/send with.
        embeddedWallets: { ethereum: { createOnLogin: "users-without-wallets" } },
        defaultChain: sepolia,
        supportedChains: [sepolia, mainnet],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <WalletBridge>{children}</WalletBridge>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
