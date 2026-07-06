import { cn } from "./cn";

/** Elevated paper surface with a hairline border. The default content container. */
export function Card({
  className,
  interactive = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-hairline bg-surface shadow-[0_1px_2px_rgba(21,22,34,0.04),0_12px_28px_-24px_rgba(21,22,34,0.28)]",
        interactive &&
          "transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-hairline-strong hover:shadow-[0_2px_4px_rgba(21,22,34,0.05),0_22px_44px_-28px_rgba(75,67,207,0.35)]",
        className,
      )}
      {...props}
    />
  );
}
