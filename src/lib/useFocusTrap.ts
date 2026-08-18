import { useEffect, type RefObject } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const container = ref.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) =>
          !el.hasAttribute("hidden") &&
          el.getAttribute("aria-hidden") !== "true" &&
          el.offsetParent !== null
      );

    const first = () => getFocusables()[0];
    const last = () => getFocusables()[getFocusables().length - 1];

    // Move focus inside the dialog on open.
    (container.contains(previouslyFocused) ? previouslyFocused : first())?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = getFocusables();
      if (focusables.length === 0) return;
      const current = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (current === focusables[0]) {
          e.preventDefault();
          last()?.focus();
        }
      } else if (current === focusables[focusables.length - 1]) {
        e.preventDefault();
        first()?.focus();
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [ref, active]);
}