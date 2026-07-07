"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { PrivyProvider, useWallets } from "@privy-io/react-auth";
import { WagmiProvider, useSetActiveWallet } from "@privy-io/wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { wagmiConfig } from "@/lib/wagmi";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";

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
        embeddedWallets: { ethereum: { createOnLogin: "off" } },
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
