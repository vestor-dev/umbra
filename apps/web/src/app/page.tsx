import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Code2,
  Eye,
  Globe,
  Lock,
  Send,
  ShieldCheck,
  Unlock,
} from "lucide-react";
import { HeroReveal } from "@/components/hero-reveal";
import { UnwrapSteps } from "@/components/unwrap-steps";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";

function HeroPill({ icon: Icon, children }: { icon: typeof Lock; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface/70 px-3 py-1.5 text-xs font-medium text-ink-soft backdrop-blur">
      <Icon className="h-3.5 w-3.5 text-accent" />
      {children}
    </span>
  );
}

/** The eclipse — Umbra's central motif. A disc in shadow, ringed with light. */
function Eclipse() {
  return (
    <div aria-hidden className="relative flex items-center justify-center">
      <div className="eclipse animate-drift h-64 w-64 sm:h-72 sm:w-72">
        {/* Crescent sheen along the illuminated edge */}
        <div className="absolute inset-0 rounded-full [mask:radial-gradient(circle_at_68%_36%,black_0,transparent_58%)] bg-[conic-gradient(from_200deg,transparent,rgba(125,116,255,0.55),rgba(47,107,240,0.4),transparent_120deg)]" />
        <div className="absolute inset-[42%] rounded-full bg-white/5 blur-md" />
      </div>
    </div>
  );
}

/* ---- App-snapshot mockups (static replicas of the real action cards) ---- */
const mockCard =
  "rounded-2xl border border-hairline bg-surface p-5 shadow-[0_1px_2px_rgba(21,22,34,0.04),0_22px_44px_-34px_rgba(21,22,34,0.5)]";
const mockTitle = "mb-3 flex items-center gap-2 text-sm font-semibold text-ink";
const mockInput =
  "flex h-10 w-full items-center rounded-xl border border-hairline bg-surface-2 px-3 font-mono text-sm text-ink";
const mockIris =
  "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-medium text-accent-fg";
const mockGreen =
  "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-success px-4 text-sm font-medium text-white";
const mockHelp = "mt-2 text-xs text-muted";

function WrapMock() {
  return (
    <div className={mockCard}>
      <h4 className={mockTitle}>
        <Lock className="h-4 w-4 text-accent" /> Wrap → cUSDC
      </h4>
      <div className="flex gap-2">
        <div className={mockInput}>100</div>
        <span className={mockIris}>Approve</span>
      </div>
      <p className={mockHelp}>Approve the wrapper to spend your tokens, then wrap.</p>
    </div>
  );
}

function RevealMock() {
  return (
    <div className="rounded-2xl border border-success/30 bg-surface px-5 py-4 shadow-[0_1px_2px_rgba(21,22,34,0.04),0_22px_44px_-34px_rgba(21,22,34,0.5)]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-muted">Your confidential cUSDC balance</div>
          <div className="mt-1.5 animate-reveal font-mono text-2xl font-semibold text-success">
            8,420.00 <span className="text-sm font-normal text-muted">cUSDC</span>
          </div>
        </div>
        <span className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-hairline bg-surface-2 px-3 text-xs font-medium text-ink-soft">
          <Eye className="h-3.5 w-3.5" /> Hide
        </span>
      </div>
      <p className="mt-2 text-xs text-muted">
        Decrypted privately via EIP-712 — only you can read this value.
      </p>
    </div>
  );
}

function SendMock() {
  return (
    <div className={mockCard}>
      <h4 className={mockTitle}>
        <Send className="h-4 w-4 text-accent" /> Send cUSDC privately
      </h4>
      <div className="grid gap-2">
        <div className={cn(mockInput, "text-muted")}>0x9a3f…E21b</div>
        <div className="flex gap-2">
          <div className={mockInput}>25</div>
          <span className={mockGreen}>Confirm send</span>
        </div>
      </div>
      <p className={mockHelp}>
        Transfers your confidential cUSDC — the amount is never revealed publicly.
      </p>
    </div>
  );
}

function UnwrapMock() {
  return (
    <div className={mockCard}>
      <h4 className={mockTitle}>
        <Unlock className="h-4 w-4 text-accent" /> Unwrap → USDC
      </h4>
      <div className="flex gap-2">
        <div className={mockInput}>50</div>
        <span className={mockIris}>Prepare unwrap</span>
      </div>
      <UnwrapSteps phase="decrypting" />
      <p className={mockHelp}>
        Burns confidential tokens, decrypts the amount, then releases the ERC-20.
      </p>
    </div>
  );
}

function EmbedMock() {
  return (
    <div className={mockCard}>
      <div className="mb-3 flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Code2 className="h-4 w-4 text-accent" /> Embed widget
        </h4>
        <span className="inline-flex items-center rounded-md border border-hairline bg-surface px-2 py-1 text-[11px] font-medium text-ink-soft">
          Copy
        </span>
      </div>
      <pre className="overflow-x-auto rounded-xl border border-hairline bg-surface-2 p-3 font-mono text-[11px] leading-relaxed text-ink-soft">
        <code>{`<iframe
  src="https://umbra.app/embed
       ?token=0x4E7B…4491"
  width="420" height="600"
></iframe>`}</code>
      </pre>
    </div>
  );
}

type Feature = {
  index: string;
  eyebrow: string;
  icon: typeof Lock;
  title: string;
  body: string;
  mock: React.ReactNode;
  reverse?: boolean;
};

function FeatureRow({ index, eyebrow, icon: Icon, title, body, mock, reverse }: Feature) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={cn(reverse && "lg:order-2")}>
        <div className="flex items-center gap-3">
          <span className="font-display text-2xl font-semibold text-accent/40">{index}</span>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            <Icon className="h-3.5 w-3.5" />
            {eyebrow}
          </span>
        </div>
        <h3 className="font-display mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-[2.4rem] sm:leading-[1.08]">
          {title}
        </h3>
        <p className="mt-4 max-w-md text-base leading-relaxed text-muted">{body}</p>
      </div>
      <div
        className={cn(
          "flex justify-center lg:justify-end",
          reverse && "lg:order-1 lg:justify-start",
        )}
      >
        <div className="relative w-full max-w-sm">
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-accent/[0.07] blur-2xl" />
          {mock}
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  const features: Feature[] = [
    {
      index: "01",
      eyebrow: "Wrap",
      icon: Lock,
      title: "Make your balance private.",
      body: "Wrapping turns a public ERC-20 into its confidential ERC-7984 twin. Approve the wrapper once, then wrap any amount — from that moment your balance lives encrypted on-chain. The total supply stays public; what you personally hold does not. Only you can decrypt it.",
      mock: <WrapMock />,
    },
    {
      index: "02",
      eyebrow: "Reveal",
      icon: Eye,
      title: "Only you can see it.",
      body: "Your confidential balance reads as “encrypted” to everyone — including block explorers. Tap Reveal and Umbra decrypts it locally with a one-time EIP-712 signature, just for you. The cleartext never touches the chain, and the session is cached so you only sign once.",
      mock: <RevealMock />,
      reverse: true,
    },
    {
      index: "03",
      eyebrow: "Send privately",
      icon: Send,
      title: "Send without revealing the amount.",
      body: "Transfer a confidential token to any address in a single transaction — the amount is encrypted end-to-end. Observers see that a transfer happened, never how much. No decrypt step, no reveal: it's privacy by default.",
      mock: <SendMock />,
    },
    {
      index: "04",
      eyebrow: "Unwrap",
      icon: Unlock,
      title: "Convert back, safely.",
      body: "Unwrapping returns your ERC-20 through a guided, fail-safe flow: burn the confidential amount, publicly decrypt it, then finalize to release the tokens. If a tab closes mid-way, Umbra detects the pending unwrap and lets you finish it — funds never get stuck.",
      mock: <UnwrapMock />,
      reverse: true,
    },
    {
      index: "05",
      eyebrow: "Embed",
      icon: Code2,
      title: "Drop privacy into any app.",
      body: "Composable by design. Any site can embed a full wrap/unwrap box with a single <iframe> — Umbra handles all the FHE encryption invisibly, so your users connect their own wallet and transact confidentially with no relayer setup on your end. Prefer to build deeper? Import the framework-agnostic @umbra/core SDK, or pull the verified list from the tokenlists.org export.",
      mock: <EmbedMock />,
    },
  ];

  return (
    <section id="how" className="scroll-mt-20 border-b border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            <ShieldCheck className="h-3.5 w-3.5" />
            How it works
          </div>
          <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            From a public token to a private one — and back.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Five moves, each fully confidential. Here&apos;s what actually happens — and what it looks
            like in the app.
          </p>
        </div>

        <div className="mt-16 space-y-20 sm:mt-20 sm:space-y-28">
          {features.map((f) => (
            <FeatureRow key={f.eyebrow} {...f} />
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-hairline pt-8 text-sm text-muted">
          <span className="text-faint">Also:</span>
          <Link
            href="/decrypt"
            className="inline-flex items-center gap-1 transition-colors hover:text-accent"
          >
            Decrypt any ERC-7984 <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/add-pair"
            className="inline-flex items-center gap-1 transition-colors hover:text-accent"
          >
            Add a custom pair <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/developers"
            className="inline-flex items-center gap-1 transition-colors hover:text-accent"
          >
            Read the developer docs <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      {/* Hero — penumbra glow, editorial headline, the eclipse + a live reveal */}
      <section className="penumbra relative overflow-hidden border-b border-hairline">
        <div className="bg-dotgrid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
        <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-20 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span
              className="animate-fade-up inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface/70 px-3 py-1 text-xs font-medium text-ink-soft opacity-0 backdrop-blur"
              style={{ animationDelay: "0.1s" }}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              Powered by Zama FHE · ERC-7984
            </span>
            <h1
              className="font-display animate-fade-up mt-5 text-[clamp(2.6rem,6.5vw,4.3rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-ink opacity-0"
              style={{ animationDelay: "0.2s" }}
            >
              Confidential value,
              <br />
              <span className="italic text-accent">out of the shadows.</span>
            </h1>
            <p
              className="animate-fade-up mt-6 max-w-md text-base leading-relaxed text-muted opacity-0 sm:text-lg"
              style={{ animationDelay: "0.35s" }}
            >
              Umbra is the registry and workstation for confidential tokens. Browse every ERC-20 ↔
              ERC-7984 pair on-chain, then wrap, send, reveal, and unwrap — with amounts encrypted
              end-to-end.
            </p>
            <div
              className="animate-fade-up mt-8 flex flex-wrap items-center gap-3 opacity-0"
              style={{ animationDelay: "0.5s" }}
            >
              <Link href="/registry" className={cn(buttonVariants({ size: "lg" }))}>
                Explore the registry
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/decrypt"
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
              >
                <Eye className="h-4 w-4" />
                Decrypt any token
              </Link>
            </div>
            <div
              className="animate-fade-up mt-10 flex flex-wrap gap-2.5 opacity-0"
              style={{ animationDelay: "0.65s" }}
            >
              <HeroPill icon={ShieldCheck}>End-to-end encrypted</HeroPill>
              <HeroPill icon={Activity}>Read live on-chain</HeroPill>
              <HeroPill icon={Globe}>Sepolia + Ethereum</HeroPill>
              <HeroPill icon={Code2}>Open SDK + token list</HeroPill>
            </div>
          </div>

          {/* Right: the eclipse with a live reveal card nested below */}
          <div className="animate-fade-up hidden flex-col items-center gap-8 opacity-0 lg:flex" style={{ animationDelay: "0.4s" }}>
            <Eclipse />
            <HeroReveal />
          </div>
        </div>
      </section>

      {/* How it works */}
      <HowItWorks />
    </main>
  );
}
