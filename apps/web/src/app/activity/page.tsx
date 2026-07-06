import type { Metadata } from "next";
import { ActivityFeed } from "@/components/activity-feed";

export const metadata: Metadata = {
  title: "Activity — Umbra",
  description: "Your confidential token activity — amounts stay encrypted on-chain.",
};

export default function ActivityPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 lg:py-16">
      <div className="animate-fade-up">
        <p className="label text-muted">Your ledger</p>
        <h1 className="font-display mt-4 text-4xl tracking-tight text-ink sm:text-5xl">
          Confidential activity
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          Your recent wraps, unwraps, sends, and receives across the registry — reconstructed from
          on-chain events, with amounts kept encrypted unless you reveal them.
        </p>
      </div>

      <div className="mt-8">
        <ActivityFeed />
      </div>
    </main>
  );
}
