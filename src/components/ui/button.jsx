import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

// The one place a button's own shape lives, written as this app's shape rather
// than as the one it was started from: the games' radius, its weight, and the
// motion of a press. It carries no focus ring of its own, because the app draws
// a single focus indicator for every control in src/index.css, and two of them
// on the same control is one too many.
//
// The colours are the app's own: amber for the thing that goes forward, red for
// the thing that deletes, and nothing decorative on the variants that do not
// colour themselves.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-colors duration-200 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-amber-500 text-[#14100A] hover:bg-amber-400",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-slate-300 bg-white text-slate-800 hover:bg-slate-100",
        secondary: "bg-white/10 text-white hover:bg-white/15",
        ghost: "hover:bg-white/10",
        link: "text-amber-700 underline underline-offset-4 hover:text-amber-800",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
