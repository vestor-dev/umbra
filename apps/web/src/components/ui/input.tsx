import { forwardRef } from "react";
import { cn } from "./cn";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-xl border border-hairline bg-surface-2 px-3.5 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-150 ease-out",
        "placeholder:text-faint hover:border-hairline-strong focus:border-accent/70 focus:bg-surface focus:shadow-[0_0_0_4px_var(--color-accent-soft)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
