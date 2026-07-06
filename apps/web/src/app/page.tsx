import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { HeroReveal } from "@/components/hero-reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";

const INDEX = [
  {
    n: "01",
    title: "Wrap",
    body: "Turn any public ERC-20 into its confidential ERC-7984 twin. Approve once, then wrap any amount.",
    href: "/registry",
  },
  {
    n: "02",
    title: "Reveal",
    body: "Your balance reads as “encrypted” to everyone. Decrypt it locally with a one-time EIP-712 signature.",
    href: "/decrypt",
  },
  {
    n: "03",
    title: "Send",
    body: "Transfer a confidential token to anyone in a single transaction — the amount stays encrypted end-to-end.",
    href: "/registry",
  },
  {
    n: "04",
    title: "Unwrap",
    body: "Burn, public-decrypt, finalize — get your ERC-20 back through a guided, fail-safe flow.",
    href: "/registry",
  },
  {
    n: "05",
    title: "Decrypt anything",
    body: "Paste any ERC-7984 address — validated on-chain via ERC-165 — and read your own balance.",
    href: "/decrypt",
  },
  {
    n: "06",
    title: "Build",
    body: "Embed a wrap/unwrap widget with one <iframe>, or read the registry with the @umbra/core SDK.",
    href: "/developers",
  },
];

export default function Home() {
  return (
    <div>
      {/* ============================ MASTHEAD ============================ */}
      <section className="bg-grid relative overflow-hidden border-b border-hairline">
        <div className="relative grid items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-24">
          <div>
            <p className="label animate-fade-up text-muted opacity-0" style={{ animationDelay: "0.05s" }}>
              Confidential token registry · Zama FHE
            </p>
            <h1
              className="font-display animate-fade-up mt-6 text-[clamp(3rem,8.5vw,5.75rem)] leading-[0.94] tracking-[-0.02em] text-ink opacity-0"
              style={{ animationDelay: "0.15s" }}
            >
              Confidential value,
              <br />
              <span className="iri-text italic">out of the shadows.</span>
            </h1>
            <p
              className="animate-fade-up mt-7 max-w-md text-lg leading-relaxed text-muted opacity-0"
              style={{ animationDelay: "0.3s" }}
            >
              Umbra is the workstation for the Zama Wrappers Registry — browse every ERC-20 ↔
              ERC-7984 pair, then wrap, send, reveal, and unwrap, with amounts encrypted
              end-to-end.
            </p>
            <div
              className="animate-fade-up mt-9 flex flex-wrap items-center gap-3 opacity-0"
              style={{ animationDelay: "0.45s" }}
            >
              <Link href="/registry" className={cn(buttonVariants({ size: "lg" }))}>
                Open the registry
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/decrypt"
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
              >
                Reveal any token
              </Link>
            </div>
            <div
              className="label animate-fade-up mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 text-faint opacity-0"
              style={{ animationDelay: "0.6s" }}
            >
              <span>End-to-end encrypted</span>
              <span className="text-hairline-strong">/</span>
              <span>Read live on-chain</span>
              <span className="text-hairline-strong">/</span>
              <span>Sepolia + Ethereum</span>
              <span className="text-hairline-strong">/</span>
              <span>Open SDK</span>
            </div>
          </div>

          {/* Pearl orb + a live redact→reveal */}
          <div className="relative hidden items-center justify-center lg:flex">
            <div className="orb h-[22rem] w-[22rem]" aria-hidden />
            <div className="absolute -bottom-4 left-1/2 w-full max-w-[20rem] -translate-x-1/2">
              <HeroReveal />
            </div>
          </div>
        </div>
      </section>

      {/* ============================ THE INDEX ============================ */}
      <section className="px-6 py-16 sm:py-24 lg:px-12">
        <div className="flex items-baseline justify-between gap-6 border-b border-ink pb-5">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">Everything you can do</h2>
          <span className="label hidden text-faint sm:block">Index — 06</span>
        </div>

        <ul>
          {INDEX.map((item) => (
            <li key={item.n}>
              <Link
                href={item.href}
                className="group grid grid-cols-[3rem_1fr_auto] items-center gap-5 border-b border-hairline py-7 transition-colors duration-200 hover:bg-ink/[0.025] sm:grid-cols-[5rem_1fr_auto] sm:gap-8"
              >
                <span className="iri-text font-display text-3xl sm:text-5xl">{item.n}</span>
                <div className="min-w-0">
                  <h3 className="font-display text-2xl text-ink sm:text-[1.75rem]">{item.title}</h3>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                    {item.body}
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-faint transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ========================= STATEMENT BAND ========================= */}
      <section className="bg-ink px-6 py-20 text-surface sm:py-28 lg:px-12">
        <p className="label text-surface/50">On-chain, forever — and still private</p>
        <p className="font-display mt-6 max-w-4xl text-[clamp(1.9rem,4.5vw,3.25rem)] leading-[1.08] tracking-[-0.01em]">
          The chain sees that value moved.{" "}
          <span className="text-surface/55 italic">It never sees how much.</span>
        </p>
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-surface/60">
          Every confidential balance and transfer is encrypted with Zama&apos;s fully homomorphic
          encryption. Totals stay public; what you personally hold, and what you move, does not —
          only you hold the key to reveal it.
        </p>
      </section>

      {/* ============================= CTA BAND ============================= */}
      <section className="px-6 py-20 sm:py-24 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <p className="label text-faint">Start here</p>
            <h2 className="font-display mt-4 max-w-2xl text-[clamp(2rem,5vw,3.5rem)] leading-[1.02] text-ink">
              Open the registry and wrap your first token.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/registry" className={cn(buttonVariants({ size: "lg" }))}>
              Browse wrappers
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/developers"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Read the docs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
