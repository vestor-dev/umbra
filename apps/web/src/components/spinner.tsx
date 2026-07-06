import { cn } from "@/components/ui/cn";

const SIZES = {
  sm: { d: "h-4 w-4", ring: "2px" },
  md: { d: "h-6 w-6", ring: "2.5px" },
  lg: { d: "h-9 w-9", ring: "3px" },
  xl: { d: "h-14 w-14", ring: "4px" },
} as const;

/** An iridescent conic-gradient ring. The house spinner. */
export function Spinner({
  size = "md",
  className,
}: {
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn("spinner inline-block shrink-0", s.d, className)}
      style={{ ["--ring" as string]: s.ring }}
    />
  );
}
