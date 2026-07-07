<div align="center">

<img src="./apps/web/public/umbra-mark.svg" alt="Umbra" width="76" />

# Umbra

### Confidential value, out of the shadows.

Wrap any ERC‑20 into an encrypted ERC‑7984 token, move it privately, and reveal
your balance to no one but yourself — a full workstation for the
[Zama Confidential Wrappers Registry](https://docs.zama.ai/protocol).

<br/>

[![Built for Zama Developer Program](https://img.shields.io/badge/Zama-Developer_Program-ffd200?style=flat-square)](https://www.zama.ai/)
[![ERC-7984](https://img.shields.io/badge/token-ERC--7984-4b43cf?style=flat-square)](https://docs.zama.ai/protocol)
[![Network](https://img.shields.io/badge/network-Sepolia_+_Ethereum-14875a?style=flat-square)](#-networks)
[![License](https://img.shields.io/badge/license-MIT-0d0d10?style=flat-square)](./LICENSE)

### ▸ [**Launch the live app →**](https://umbra-web-nine.vercel.app)

🎬 **Video:** _add after recording_ · 🧵 **X thread:** _add after posting_

</div>

---

## 🌙 The 30‑second version

Public tokens leak everything — anyone can see exactly what you hold and move.
**Confidential tokens fix that.** Zama's FHE (fully homomorphic encryption) lets a
token keep every balance and transfer *encrypted on‑chain*, while still being a
real, composable ERC token.

Umbra is the front door to that world:

> **Wrap** your public USDC → get confidential cUSDC. **Send** it — observers see
> *that* it moved, never *how much*. **Reveal** your own balance with a signature.
> **Unwrap** back to USDC whenever you want.

```
  ERC-20 (public)                         ERC-7984 (confidential)
  ┌──────────────┐     wrap  ───────►     ┌──────────────────────┐
  │   1,000 USDC │                        │  ●●●●● cUSDC          │  ← encrypted,
  │  (everyone   │     ◄───────  unwrap   │  only you can reveal  │    even to explorers
  │   can see)   │                        └──────────────────────┘
  └──────────────┘
```

Everyone knows the *total* supply. **What you personally hold stays yours.**

---

## Contents

- [What you can do](#-what-you-can-do)
- [Run it in 60 seconds](#-run-it-in-60-seconds)
- [How it works](#-how-it-works)
- [Repo map](#-repo-map)
- [Build on Umbra](#-build-on-umbra)
- [Networks](#-networks)
- [Configuration](#-configuration)
- [Tech stack](#-tech-stack)
- [FAQ](#-faq)

---

## ✨ What you can do

Umbra is organised as a **workstation** — one sidebar, four rooms:

| Room | Route | What happens there |
|------|-------|--------------------|
| **Wrappers** | `/registry` | Browse every ERC‑20 ↔ ERC‑7984 pair, read live from chain and provenance‑badged. Open one to act on it. |
| **Reveal** | `/decrypt` | Paste *any* ERC‑7984 address and privately decrypt your own balance — even tokens not in the registry. |
| **Ledger** | `/activity` | Your wraps, unwraps, sends & receives, reconstructed from on‑chain events. Amounts stay encrypted. |
| **Build** | `/developers` | Live docs for the SDK + embeddable widget. |

Open any pair and you get the full lifecycle in one panel:

```
 Faucet ──► Wrap ──► Reveal ──► Send ──► Unwrap
   │          │         │         │         │
 mint       ERC-20    EIP-712   encrypted  burn → public-decrypt
 mocks    → ERC-7984  decrypt   transfer   → finalize → ERC-20 back
```

Plus the things that make it feel finished: **pending‑unwrap recovery** (close a tab
mid‑unwrap and Umbra lets you finish it — funds never get stuck), a **universal
decryptor**, an **embeddable widget**, and a **tokenlists.org export**.

---

## 🚀 Run it in 60 seconds

```bash
# 1. clone & install (pnpm workspace)
git clone https://github.com/vestor-dev/umbra
cd umbra && pnpm install

# 2. (optional) add env — every value has a public fallback
cp apps/web/.env.example apps/web/.env.local

# 3. go
pnpm dev            # ▸ http://localhost:3000
```

That's it — it boots with public RPCs and no secrets. To actually *transact*, connect
a wallet on **Sepolia** and hit the faucet. See [Configuration](#-configuration) for
the (optional) keys that make it faster.

---

## 🧠 How it works

### The big picture

```
      ┌─────────────────┐        ┌──────────────┐        ┌────────────────────┐
      │   apps/web      │ reads  │  @umbra/core │  calls │  Zama on Sepolia   │
      │  Next.js · React│ ─────► │  SDK (viem)  │ ─────► │  registry + FHE     │
      │  wagmi · Privy  │        │  read+verify │        │  relayer (WASM)     │
      └─────────────────┘        └──────────────┘        └────────────────────┘
             ▲                                                     │
             │  all encryption happens in YOUR browser            │
             └─────────────────────────────────────────────────────┘
```

Two rules keep it honest:

1. **Keys never leave your browser.** Confidential crypto runs client‑side via Zama's
   relayer SDK (WASM), loaded lazily only when you first reveal/decrypt. The app is
   served cross‑origin‑isolated (COOP/COEP) so the threaded WASM can run.
2. **The chain is the source of truth.** Server components read the registry through
   `@umbra/core` and hand the client a plain, serialisable `UiPair` — no RPC secrets
   or private data ever reach the browser bundle.

### Where the pair list comes from (hybrid)

Umbra merges **two layers**, and the chain always wins:

- **On‑chain registry** *(primary)* — every load reads the official Zama registry in
  one multicall, then enriches each pair with metadata, an ERC‑165 `supportsInterface`
  check, the conversion rate, and a bidirectional‑link check. Cached 60s.
- **Local config** *(additive)* — `committedCustomPairs` in
  [`apps/web/src/lib/custom-pairs.ts`](apps/web/src/lib/custom-pairs.ts) surfaces pairs
  not yet on‑chain (local dev, a freshly deployed wrapper).

Every pair is **provenance‑labelled** so trust is never ambiguous:

| Badge | Meaning |
|-------|---------|
| 🟢 **Official** | In the registry, valid, implements ERC‑7984 |
| 🔵 **Mock** | Official testnet mock token |
| ⚪ **Custom** | You added it (never shown as Official) |
| 🟠 **Unverified** | In the registry but failed a check |

---

## 🗂 Repo map

```
umbra/
├── apps/web/                     # the Next.js app
│   └── src/
│       ├── app/                  # routes (App Router)
│       │   ├── page.tsx          #   /            landing
│       │   ├── registry/         #   /registry    the wrapper explorer
│       │   ├── pair/[wrapper]/   #   /pair/…      one token: faucet/wrap/unwrap/send
│       │   ├── decrypt/          #   /decrypt     universal decryptor
│       │   ├── activity/         #   /activity    your confidential ledger
│       │   ├── developers/       #   /developers  live docs
│       │   ├── embed/            #   /embed       chrome-free iframe widget
│       │   └── api/              #   token-list · activity · pending-unwraps
│       ├── components/           # UI + feature components (app-shell, pair-actions, …)
│       └── lib/                  # clients · wagmi · fhevm · registry-data · pair
│
├── packages/core/                # @umbra/core — framework-agnostic read/verify SDK
│   └── src/                      # abis · chains · registry · verify · types
│
└── pnpm-workspace.yaml           # pnpm + Turborepo monorepo
```

---

## 🧩 Build on Umbra

**Embed** a full wrap/unwrap box in any site — one line:

```html
<iframe
  src="https://umbra-web-nine.vercel.app/embed?token=0xYourWrapperAddress"
  width="420" height="600" style="border:0;border-radius:16px"
></iframe>
```

**Read the registry** yourself with the SDK:

```ts
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { getEnrichedPairs, SEPOLIA_CHAIN_ID } from "@umbra/core";

const client = createPublicClient({ chain: sepolia, transport: http() });
const pairs = await getEnrichedPairs(client, SEPOLIA_CHAIN_ID);
// → every pair, enriched with metadata + validated on-chain
```

**Consume the token list** (standard [tokenlists.org](https://tokenlists.org) schema):

```
GET /api/token-list                 # official pairs
GET /api/token-list?include=mock    # + testnet mocks
GET /api/token-list?chainId=11155111
```

---

## 🌐 Networks

| Network | Chain ID | Mode | Registry |
|---------|----------|------|----------|
| **Sepolia** | `11155111` | Full — read + write | `0x2f0750Bbb0A246059d80e94c454586a7F27a128e` |
| **Ethereum** | `1` | Read‑only browse | `0xeb5015fF021DB115aCe010f23F55C2591059bBA0` |

All confidential operations (wrap / unwrap / decrypt) run on **Sepolia** via the Zama
relayer. Mainnet is browse‑only today; mainnet writes are one config away.

---

## ⚙️ Configuration

Everything is optional — copy `apps/web/.env.example` → `.env.local` and fill what you want:

| Variable | What it does | Needed? |
|----------|--------------|---------|
| `NEXT_PUBLIC_PRIVY_APP_ID` | Wallet connect via [Privy](https://privy.io) (EVM wallets + email) | Recommended |
| `NEXT_PUBLIC_SEPOLIA_RPC_URL` | Your Sepolia RPC (falls back to public nodes) | Optional |
| `NEXT_PUBLIC_MAINNET_RPC_URL` | Ethereum RPC for read‑only browse | Optional |
| `NEXT_PUBLIC_RELAYER_URL` | Zama relayer endpoint (Sepolia) | Optional |

> **Privy note:** `localhost` works out of the box. Before deploying, add your
> production domain to the app's *allowed origins* in the Privy dashboard.

---

## 🛠 Tech stack

- **App** — Next.js 15 (App Router, RSC) · React 19 · TypeScript
- **Chain** — wagmi v3 · viem · Privy (`@privy-io/react-auth` + `@privy-io/wagmi`)
- **Confidential** — `@zama-fhe/relayer-sdk` (client‑side WASM)
- **UI** — Tailwind CSS v4 · Geist · a monochrome "Pearl & Ink" design system with an iridescent sheen
- **Monorepo** — pnpm workspaces + Turborepo

---

## ❓ FAQ

<details>
<summary><b>Can people see how much confidential token I hold or send?</b></summary>

No. Balances and transfer amounts are encrypted with FHE. Observers (and block
explorers) see that a transfer happened, never the amount. Only you can decrypt your
own balance, via an EIP‑712 signature.
</details>

<details>
<summary><b>How do I get test tokens?</b></summary>

Open any <b>Mock</b> pair in the registry and use the <b>Faucet</b> tab to mint the
underlying ERC‑20, then <b>Wrap</b> it into the confidential version.
</details>

<details>
<summary><b>What happens if I close the tab mid‑unwrap?</b></summary>

Unwrapping is a multi‑step async flow (burn → public‑decrypt → finalize). If it's
interrupted, Umbra detects the pending unwrap on the pair page and lets you finish it —
your funds are never stuck.
</details>

<details>
<summary><b>Is this only for the registry's tokens?</b></summary>

No. The <b>Reveal</b> page decrypts <i>any</i> ERC‑7984 token (validated on‑chain via
ERC‑165), and you can add your own pairs via <b>Add a pair</b>.
</details>

---

<div align="center">

Built with 🌙 for the **Zama Developer Program** · Powered by Zama FHE

**MIT** licensed — see [LICENSE](./LICENSE)

</div>
