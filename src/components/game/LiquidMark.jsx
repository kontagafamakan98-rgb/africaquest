import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * The mark that says which item of a strip is the chosen one.
 *
 * One element is drawn for the whole strip and moved to wherever the choice is,
 * instead of every item drawing its own and the highlight jumping from one to
 * the next. The mark therefore reads as one object travelling, and on a strip
 * whose items are not all the same size it stretches on the way and settles,
 * which is the whole of the effect: nothing else moves.
 *
 * Two strips must never share a mark, or the highlight would fly across the
 * screen between them, so each caller gives its own `layoutId`.
 *
 * The mark is drawn, not spoken. Every strip keeps its own accessibility: the
 * items carry `aria-current` or `aria-pressed`, which is what a reader hears,
 * and this element is hidden from that reading.
 *
 * The container the mark is placed in has to be isolated (Tailwind `isolate`)
 * and positioned (`relative`). Isolation lets the mark sit at a negative depth,
 * which is what puts it behind the icon or the label instead of over it without
 * every caller having to lift its own content out of the way.
 */
export default function LiquidMark({ layoutId, className }) {
  // Whoever asked their device for less motion gets the mark where it belongs,
  // at once: a highlight that glides across the screen is exactly what that
  // setting is about.
  const still = useReducedMotion();

  return (
    <motion.span
      layoutId={layoutId}
      aria-hidden="true"
      // The place it takes is the caller's: `inset-0` to fill the item, or a
      // mark of its own shape such as the underline under a tab.
      className={cn("absolute -z-10 pointer-events-none", className)}
      transition={still ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32, mass: 0.7 }}
    />
  );
}
