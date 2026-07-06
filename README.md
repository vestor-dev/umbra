<div align="center">

<img src="./apps/web/public/umbra-mark.svg" alt="Umbra" width="88" />

# Umbra

**Confidential value, out of the shadows.**

The registry and workstation for confidential tokens — browse every ERC‑20 ↔ ERC‑7984 pair in the [Zama Wrappers Registry](https://docs.zama.ai/protocol), then wrap, unwrap, send, and decrypt **any** confidential balance. Full read + write on Sepolia; read‑only browse on Ethereum.

🌐 **Live:** _add after deploy_ · 🎬 **Demo:** _add after recording_ · 🧵 **Thread:** _add after posting_

</div>

---

## What it is

The Zama Wrappers Registry is an on‑chain directory mapping standard ERC‑20 tokens to their confidential ERC‑7984 counterparts. It's powerful but raw — just contract calls. **Umbra turns it into a product**: a fast explorer over the live registry, the full confidential‑token lifecycle (faucet → wrap → reveal → send → unwrap), a universal decryptor for *any* ERC‑7984 token, a hybrid registry anyone can extend, and a reusable SDK + token list for other developers.

Built for the **Zama Developer Program — Bounty Track** (Confidential Wrapper Registry challenge).

## Features

| | Feature | Notes |
|---|---|---|
| 🔎 | **Live registry explorer** | Every pair read on‑chain via multicall, enriched with metadata, searchable, provenance‑badged. Sepolia + Ethereum. |
| 🪙 | **Faucet** | Mint official Sepolia `cTokenMock` underlyings to test with. |
| 📦 | **Wrap** | ERC‑20 → confidential ERC‑7984 (approve + wrap). |
| 🔓 | **Unwrap** | Full async protocol: burn → public‑decrypt → finalize, driven entirely by the dApp. |
| 💸 | **Confidential send** | Transfer an ERC‑7984 to anyone — the amount stays **encrypted end‑to‑end** (one tx, no decrypt). |
| 👁️ | **Reveal balance** | EIP‑712 user‑decrypt of your confidential balance, with session caching. |
| 🌐 | **Decrypt *any* ERC‑7984** | Paste any confidential token address — auto‑validates via ERC‑165 and decrypts. Not limited to the registry. |
| ♻️ | **Pending‑unwrap recovery** | Detects unwraps burned but never finalized (e.g. a closed tab) and lets you finish them. Funds never get stuck. |
| ➕ | **Hybrid registry + add‑a‑pair** | On‑chain registry is the source of truth; add extra pairs via the in‑app form or committed config. |
| 🧩 | **Embeddable widget** | Drop a wrap/unwrap box into any site with one `<iframe>`. |
| 🧱 | **Developer SDK + token list** | `@umbra/core` package and a [tokenlists.org](https://tokenlists.org)‑schema export at `/api/token-list`. |

## Supported networks

| Network | Chain ID | Mode | Registry |
|---|---|---|---|
| **Sepolia** | `11155111` | Full (read + write) | `0x2f0750Bbb0A246059d80e94c454586a7F27a128e` |
| **Ethereum** | `1` | Read‑only browse | `0xeb5015fF021DB115aCe010f23F55C2591059bBA0` |

All confidential operations (wrap/unwrap/decrypt) run on **Sepolia** via the Zama relayer. Mainnet is browse‑only.

## How the registry is sourced (hybrid)

Umbra sources pairs from **two layers**, with the chain always winning:

1. **On‑chain registry (source of truth).** On every load the app reads the official Zama registry for the active network — the full pair set in one multicall — then enriches each pair with token metadata (`symbol`, `name`, `decimals`), an ERC‑165 `supportsInterface` check, the conversion rate, and a bidirectional‑link check. Cached server‑side for 60s.
2. **Local config (additive).** A committed array, `committedCustomPairs` in [`apps/web/src/lib/custom-pairs.ts`](apps/web/src/lib/custom-pairs.ts), surfaces pairs not yet in the on‑chain registry — useful for local dev or a freshly deployed wrapper.

Every pair is **provenance‑labeled**: **Official** (in the registry, valid, implements ERC‑7984), **Mock** (official testnet mock), **Custom** (added by you), or **Unverified** (in the registry but failed a check).

## Architecture

A pnpm + Turborepo monorepo:

```
apps/web        Next.js 15 · React 19 · wagmi v3 · viem · Tailwind v4 · Zama relayer SDK
packages/core   @umbra/core — framework‑agnostic read/verify SDK for the registry
```

- **Confidential crypto** runs entirely client‑side via `@zama-fhe/relayer-sdk` (WASM), loaded lazily and only when a user first reveals/decrypts. The app is served cross‑origin‑isolated (COOP/COEP) for the threaded WASM.
- **Server components** read the registry through `@umbra/core` and hand a serializable `UiPair` to the client — no keys or RPC secrets ever reach the browser.

## Getting started

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local   # optional — public RPC fallbacks work out of the box
pnpm dev                                        # http://localhost:3000
```

Optional environment variables (all have sensible fallbacks):

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_SEPOLIA_RPC_URL` | Sepolia RPC (Alchemy/Infura/…); public node used if blank |
| `NEXT_PUBLIC_MAINNET_RPC_URL` | Ethereum RPC for read‑only browse |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Enables the WalletConnect connector |
| `NEXT_PUBLIC_RELAYER_URL` | Zama relayer endpoint (Sepolia) |

## Building on Umbra

**Embed** a full wrap/unwrap box in any site:

```html
<iframe
  src="https://umbra.app/embed?token=0xYourWrapperAddress"
  width="420" height="600" style="border:0;border-radius:16px"
></iframe>
```

**Use the SDK** to read + verify the registry yourself:

```ts
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { getEnrichedPairs, SEPOLIA_CHAIN_ID } from "@umbra/core";

const client = createPublicClient({ chain: sepolia, transport: http() });
const pairs = await getEnrichedPairs(client, SEPOLIA_CHAIN_ID);
```

**Pull the token list** (tokenlists.org schema) from `/api/token-list` (`?include=mock`, `?chainId=`).

## License

MIT — see [LICENSE](LICENSE).
