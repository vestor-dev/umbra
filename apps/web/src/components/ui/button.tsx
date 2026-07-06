import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

const buttonVariants = cva(
  "group/btn inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-tight transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none hover:-translate-y-px active:translate-y-0 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        // The single primary action on a surface — solid ink pill.
        primary: "bg-accent text-accent-fg shadow-pill hover:bg-accent-hover",
        // Reserved for "revealed / confirmed" confidential moments.
        success: "bg-success text-white shadow-pill hover:brightness-[1.06]",
        // Quiet secondary fill — a raised white pill.
        secondary:
          "border border-hairline bg-surface text-ink shadow-soft hover:bg-surface-2 hover:shadow-float",
        outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink/[0.04]",
        ghost: "text-muted hover:bg-ink/[0.05] hover:text-ink",
        warn: "bg-warn text-white shadow-pill hover:brightness-[1.06]",
      },
      size: {
        sm: "h-8 px-4 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-sm",
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
