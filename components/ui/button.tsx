import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan",
  {
    variants: {
      variant: {
        primary: "bg-grad-brand text-[#04121a] font-semibold hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(53,212,255,0.35)]",
        ghost:
          "bg-white/[0.04] border border-white/[0.08] text-ink hover:border-cyan/40 hover:bg-white/[0.07] hover:-translate-y-0.5",
        link: "text-cyan underline-offset-4 hover:underline",
      },
      size: {
        default: "px-5 py-3",
        sm: "px-4 py-2 text-[0.82rem]",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
