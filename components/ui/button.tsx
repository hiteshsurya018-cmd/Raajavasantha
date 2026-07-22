"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full font-semibold transition-all duration-300 ease-editorial disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-canvas shadow-soft hover:bg-primary-600 hover:shadow-lift hover:-translate-y-0.5",
        secondary:
          "bg-secondary text-primary-700 shadow-soft hover:bg-secondary-600 hover:shadow-lift hover:-translate-y-0.5",
        outline:
          "border border-ink/20 text-ink bg-transparent hover:border-primary hover:text-primary dark:border-white/20 dark:text-white",
        ghost:
          "text-ink hover:bg-ink/5 dark:text-white dark:hover:bg-white/10",
        glass:
          "glass border border-white/40 text-ink shadow-glass hover:-translate-y-0.5",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-6 text-[0.95rem]",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, children, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<{ x: number; y: number; id: number }[]>([]);

    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
      const rect = e.currentTarget.getBoundingClientRect();
      const id = Date.now();
      setRipples((r) => [...r, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
      window.setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 700);
      onClick?.(e);
    }

    const classes = cn(buttonVariants({ variant, size, className }));

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<{
        className?: string;
        onClick?: React.MouseEventHandler<HTMLElement>;
      }>;
      return React.cloneElement(child, {
        className: cn(classes, child.props.className),
        onClick: onClick as React.MouseEventHandler<HTMLElement> | undefined,
      });
    }

    return (
      <button ref={ref} className={classes} onClick={handleClick} {...props}>
        {children}
        {ripples.map((r) => (
          <span
            key={r.id}
            aria-hidden
            className="pointer-events-none absolute rounded-full bg-white/50 animate-ripple"
            style={{ left: r.x - 10, top: r.y - 10, width: 20, height: 20 }}
          />
        ))}
      </button>
    );
  }
);
Button.displayName = "Button";
