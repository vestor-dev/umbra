import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-tight transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-out focus-visible:outline-none active:translate-y-px disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        // The single primary action on a surface — twilight iris.
        primary:
          "bg-accent text-accent-fg hover:bg-accent-hover shadow-[0_12px_30px_-14px_rgba(75,67,207,0.6)]",
        // Reserved for "revealed / confirmed" confidential moments.
        success: "bg-success text-white hover:brightness-[1.06]",
        // Quiet secondary fill — a raised paper chip.
        secondary:
          "border border-hairline-strong bg-surface text-ink shadow-[0_1px_2px_rgba(21,22,34,0.05)] hover:bg-surface-2",
        outline:
          "border border-hairline text-ink-soft hover:border-hairline-strong hover:bg-surface-2",
        ghost: "text-muted hover:bg-ink/[0.05] hover:text-ink",
        warn: "bg-warn text-white hover:brightness-[1.06]",
      },
      size: {
        sm: "h-8 px-3.5 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-11 px-6 text-sm",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
