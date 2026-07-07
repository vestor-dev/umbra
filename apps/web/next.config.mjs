/** @type {import('next').NextConfig} */

// wagmi v3's connectors barrel (pulled in by @privy-io/wagmi) lazy-imports a set
// of OPTIONAL wallet SDKs we don't use (Privy manages wallets). Stub the
// unresolved ones so webpack doesn't error on them.
const OPTIONAL_WALLET_DEPS = [
  "accounts",
  "porto",
  "porto/wagmi",
  "@base-org/account",
  "@metamask/sdk",
  "@metamask/connect-evm",
  "@safe-global/safe-apps-sdk",
  "@safe-global/safe-apps-provider",
  // Privy optional integrations we don't use (Stripe on-ramp, Farcaster/Solana):
  "@stripe/crypto",
  "@stripe/stripe-js",
  "@farcaster/mini-app-solana",
  "@farcaster/frame-sdk",
  "@farcaster/miniapp-sdk",
];

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@umbra/core"],
  // The relayer SDK is browser-only (WASM); never bundle it on the server.
  serverExternalPackages: ["@zama-fhe/relayer-sdk"],
  eslint: {
    // Lint is run as its own CI step, not during builds.
    ignoreDuringBuilds: true,
  },
  // NOTE: we intentionally do NOT set cross-origin-isolation (COOP/COEP) headers.
  // They'd let the Zama relayer SDK run multi-threaded, but they also break Privy's
  // embedded-wallet iframe (email/social login hangs on "Creating your wallet").
  // The SDK's initSDK() gracefully falls back to single-threaded when isolation is
  // absent, so decryption still works — a small speed cost to keep email onboarding.
  webpack: (config) => {
    // The /web relayer SDK ships WASM loaded as async modules.
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    // Resolve the optional wallet SDKs to empty modules instead of failing.
    config.resolve.fallback = { ...config.resolve.fallback };
    for (const dep of OPTIONAL_WALLET_DEPS) config.resolve.fallback[dep] = false;
    return config;
  },
};

export default nextConfig;
