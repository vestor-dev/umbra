import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Boxes,
  GitBranch,
  Globe,
  Info,
  Layers,
  Radio,
} from "lucide-react";
import { EmbedSnippet } from "@/components/embed-snippet";
import { SdkExamples } from "@/components/sdk-examples";
import { DocsNav } from "@/components/docs-nav";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";

export const metadata: Metadata = {
  title: "Build — Umbra",
  description: "How Umbra works, plus the SDK and embed widget to build confidential apps.",
};

const REPO = "https://github.com/vestor-dev/umbra";
const SAMPLE_TOKEN = "0x4E7B06D78965594eB5EF5414c357ca21E1554491"; // cUSDTMock

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "architecture", label: "Architecture" },
  { id: "quickstart", label: "Quickstart" },
  { id: "sdk", label: "SDK" },
  { id: "embed", label: "Embed widget" },
  { id: "tokenlist", label: "Token list" },
  { id: "networks", label: "Networks" },
  { id: "resources", label: "Resources" },
];

const RESOURCES = [
  { label: "Documentation", note: "README & guides", href: `${REPO}#readme`, Icon: BookOpen },
  { label: "ERC-7984", note: "The confidential-token standard", href: "https://docs.zama.ai/protocol", Icon: Globe },
  { label: "GitHub", note: "Open-source monorepo", href: REPO, Icon: GitBranch },
] as const;

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-hairline bg-ink px-4 py-3.5 font-mono text-[13px] leading-relaxed text-surface/90 shadow-soft">
      <code>{children}</code>
    </pre>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <Reveal>
        <p className="label text-faint">{eyebrow}</p>
        <h2 className="font-display mt-2 text-3xl tracking-tight text-ink">{title}</h2>
        <div className="mt-5">{children}</div>
      </Reveal>
    </section>
  );
}

const proseP = "max-w-2xl text-[15px] leading-relaxed text-muted";

export default function DevelopersPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:px-10 lg:py-16">
      {/* Hero */}
      <Reveal className="border-b border-hairline pb-12">
        <p className="label text-muted">Documentation</p>
        <h1 className="font-display mt-4 text-5xl tracking-tight text-ink sm:text-6xl">
          Build on Umbra
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          Umbra is an open-source workstation for the Zama Wrappers Registry. Read the registry with
          the <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-ink">@umbra/core</code>{" "}
          SDK, or drop a full wrap/unwrap experience into any site with one{" "}
          <code className="font-mono text-ink">&lt;iframe&gt;</code>.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href={REPO} target="_blank" rel="noreferrer" className={cn(buttonVariants({ size: "lg" }))}>
            <GitBranch className="h-4 w-4" />
            View on GitHub
          </a>
          <Link href="/registry" className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}>
            Open the registry
          </Link>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-12 lg:grid-cols-[180px_1fr] lg:gap-16">
        <DocsNav items={TOC} />

        <div className="min-w-0 space-y-16">
          {/* Overview */}
          <Section id="overview" eyebrow="01 · What it is" title="A product on top of the registry">
            <p className={proseP}>
              The Zama Wrappers Registry is an on-chain directory that maps every public ERC-20 to
              its confidential ERC-7984 counterpart. It&apos;s powerful, but raw — just contract
              calls. Umbra turns it into a usable product: a live explorer, the full confidential
              lifecycle (faucet → wrap → reveal → send → unwrap), a universal decryptor for any
              ERC-7984, an embeddable widget, and a reusable SDK.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { Icon: Boxes, t: "Live explorer", d: "Every pair, read on-chain and provenance-badged." },
                { Icon: Layers, t: "Full lifecycle", d: "Wrap, reveal, send, unwrap — encrypted end-to-end." },
                { Icon: Radio, t: "Composable", d: "SDK + iframe widget + token-list export." },
              ].map(({ Icon, t, d }) => (
                <div key={t} className="rounded-2xl border border-hairline bg-surface p-4 shadow-soft">
                  <Icon className="h-5 w-5 text-ink" />
                  <p className="mt-3 text-sm font-medium text-ink">{t}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{d}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Architecture */}
          <Section id="architecture" eyebrow="02 · How it fits together" title="Architecture">
            <p className={proseP}>
              A pnpm + Turborepo monorepo. The web app reads the registry through the framework-
              agnostic core SDK; all confidential cryptography runs client-side via Zama&apos;s
              relayer SDK (WASM), so no keys ever touch a server.
            </p>
            <div className="mt-6 grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
              {[
                { t: "apps/web", d: "Next.js · React · wagmi · viem" },
                { t: "@umbra/core", d: "read + verify SDK" },
                { t: "Zama on Sepolia", d: "registry + FHE relayer" },
              ].map((b, i) => (
                <Fragment key={b.t}>
                  <div className="flex flex-col justify-center rounded-2xl border border-hairline bg-surface px-4 py-5 text-center shadow-soft">
                    <p className="font-mono text-sm font-medium text-ink">{b.t}</p>
                    <p className="mt-1 text-xs text-muted">{b.d}</p>
                  </div>
                  {i < 2 && (
                    <div className="flex items-center justify-center text-faint">
                      <ArrowUpRight className="h-5 w-5 rotate-45 sm:rotate-0" />
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </Section>

          {/* Quickstart */}
          <Section id="quickstart" eyebrow="03 · Run it locally" title="Quickstart">
            <p className={proseP}>Clone the monorepo, install, and start the dev server.</p>
            <div className="mt-5">
              <Code>{`git clone ${REPO}
cd umbra && pnpm install
pnpm dev            # → http://localhost:3000`}</Code>
            </div>
            <p className="mt-4 text-sm text-muted">
              Every environment variable has a public fallback, so it runs with an empty{" "}
              <code className="font-mono text-ink">.env.local</code> out of the box.
            </p>
          </Section>

          {/* SDK */}
          <Section id="sdk" eyebrow="04 · @umbra/core" title="The SDK">
            <p className={cn(proseP, "mb-5")}>
              A framework-agnostic read/verify layer for the registry. Give it a viem client and it
              returns every pair, enriched with metadata and validated on-chain.
            </p>
            <SdkExamples />
          </Section>

          {/* Embed */}
          <Section id="embed" eyebrow="05 · One iframe" title="Embed widget">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <p className="text-[15px] leading-relaxed text-muted">
                  Add a wrap/unwrap box to any site with a single{" "}
                  <code className="font-mono text-ink">&lt;iframe&gt;</code>. Users connect their own
                  wallet; Umbra handles all the FHE encryption invisibly.
                </p>
                <EmbedSnippet token={SAMPLE_TOKEN} />
                <div className="mt-6">
                  <p className="label text-faint">Parameters</p>
                  <dl className="mt-3 space-y-2.5 text-sm">
                    <div className="flex gap-3">
                      <dt className="w-16 shrink-0 font-mono text-ink">token</dt>
                      <dd className="text-muted">ERC-7984 wrapper address <span className="text-faint">· required</span></dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="w-16 shrink-0 font-mono text-ink">u</dt>
                      <dd className="text-muted">Underlying ERC-20 — only for custom pairs</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="w-16 shrink-0 font-mono text-ink">action</dt>
                      <dd className="text-muted">
                        <code className="font-mono text-ink">wrap</code> (default) or{" "}
                        <code className="font-mono text-ink">unwrap</code>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs text-muted">Live preview — this is a real iframe</p>
                <div className="overflow-hidden rounded-2xl border border-hairline bg-surface shadow-float">
                  <div className="flex items-center gap-2 border-b border-hairline bg-surface-2 px-3 py-2.5">
                    <span className="flex gap-1.5" aria-hidden>
                      <span className="h-2.5 w-2.5 rounded-full bg-danger/50" />
                      <span className="h-2.5 w-2.5 rounded-full bg-warn/50" />
                      <span className="h-2.5 w-2.5 rounded-full bg-success/50" />
                    </span>
                    <span className="ml-2 flex-1 truncate rounded-md bg-canvas px-2.5 py-1 text-center font-mono text-[11px] text-muted">
                      your-site.com
                    </span>
                  </div>
                  <iframe
                    src={`/embed?token=${SAMPLE_TOKEN}`}
                    title="Umbra wrap widget"
                    className="h-150 w-full bg-canvas"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-hairline bg-surface p-4 text-xs leading-relaxed text-muted shadow-soft">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-faint" />
              <span>
                Cross-origin embedding requires the host page to send a{" "}
                <code className="font-mono text-ink">Cross-Origin-Embedder-Policy</code> header (the
                FHE SDK needs cross-origin isolation). Same-origin embeds work out of the box.
              </span>
            </div>
          </Section>

          {/* Token list */}
          <Section id="tokenlist" eyebrow="06 · Interop" title="Token list">
            <p className={proseP}>
              Umbra exports every registry pair in the{" "}
              <a
                href="https://tokenlists.org"
                target="_blank"
                rel="noreferrer"
                className="text-ink underline underline-offset-2"
              >
                tokenlists.org
              </a>{" "}
              schema, so any wallet or aggregator can consume it.
            </p>
            <div className="mt-5">
              <Code>{`GET /api/token-list            # official pairs
GET /api/token-list?include=mock
GET /api/token-list?chainId=11155111`}</Code>
            </div>
          </Section>

          {/* Networks */}
          <Section id="networks" eyebrow="07 · Where it runs" title="Networks">
            <div className="overflow-hidden rounded-2xl border border-hairline bg-surface shadow-soft">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-hairline bg-surface-2 text-left">
                    <th className="label px-5 py-3 font-normal text-faint">Network</th>
                    <th className="label px-5 py-3 font-normal text-faint">Mode</th>
                    <th className="label px-5 py-3 font-normal text-faint">Registry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  <tr>
                    <td className="px-5 py-3.5 font-medium text-ink">Sepolia</td>
                    <td className="px-5 py-3.5 text-muted">Full — read + write</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-muted">0x2f0750…a128e</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3.5 font-medium text-ink">Ethereum</td>
                    <td className="px-5 py-3.5 text-muted">Read-only browse</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-muted">0xeb5015…9bBA0</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 flex items-start gap-2.5 text-xs leading-relaxed text-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-faint" />
              Confidential ops run on Sepolia. Ethereum is read-only today — mainnet writes are on
              the roadmap (one config away).
            </p>
          </Section>

          {/* Resources */}
          <Section id="resources" eyebrow="08 · Go deeper" title="Resources">
            <div className="grid gap-3 sm:grid-cols-3">
              {RESOURCES.map(({ label, note, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 rounded-2xl border border-hairline bg-surface p-4 shadow-soft transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-float"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-ink">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-ink">{label}</span>
                    <span className="block truncate text-xs text-muted">{note}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-faint transition-colors group-hover:text-ink" />
                </a>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
