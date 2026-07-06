import { createConfig } from "@privy-io/wagmi";
import { fallback, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

/**
 * wagmi config for Privy. Privy manages the connectors (external EVM wallets +
 * optional embedded), so we only declare chains + transports here.
 */
export const wagmiConfig = createConfig({
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: fallback([
      http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
      http("https://ethereum-sepolia-rpc.publicnode.com"),
      http("https://11155111.rpc.thirdweb.com"),
      http(),
    ]),
    [mainnet.id]: fallback([
      http(process.env.NEXT_PUBLIC_MAINNET_RPC_URL),
      http("https://ethereum-rpc.publicnode.com"),
      http(),
    ]),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
