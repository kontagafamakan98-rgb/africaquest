import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keyboard and screen reader behaviour for bottom-sheet style dialogs:
 * moves focus into the dialog, keeps Tab inside it, closes on Escape and
 * returns focus to the element that opened it.
 */
export function useModalA11y({ open, onClose, containerRef }) {
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    previouslyFocused.current = document.activeElement;
    const container = containerRef.current;
    if (!container) return undefined;

    const getFocusable = () =>
      Array.from(container.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.getAttribute("aria-hidden") !== "true"
      );

    const firstFocusable = getFocusable()[0];
    (firstFocusable || container).focus?.({ preventScroll: true });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
        return;
      }
      if (event.key !== "Tab") return;

      const items = getFocusable();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus?.({ preventScroll: true });
    };
  }, [open, onClose, containerRef]);
}
