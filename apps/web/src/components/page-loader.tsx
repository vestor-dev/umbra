import { Spinner } from "@/components/spinner";

/** Centered branded loader — an iridescent ring over a soft pearl bloom. */
export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center gap-6 px-6">
      <div className="relative grid place-items-center">
        <div className="orb absolute h-20 w-20 opacity-70 blur-[3px]" aria-hidden />
        <Spinner size="xl" className="relative" />
      </div>
      <p className="label animate-pulse text-faint">{label}</p>
    </div>
  );
}
