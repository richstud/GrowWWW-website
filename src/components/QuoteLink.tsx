import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/**
 * "Get a free quote" button. If the page has the enquiry form, it scrolls to it and puts the cursor
 * in the first field; otherwise it opens the Contact page.
 */
export const QuoteLink = ({ className, children }: { className?: string; children: ReactNode }) => (
  <Link
    to="/contact"
    className={className}
    onClick={(e) => {
      const form = document.getElementById("enquiry");
      if (!form) return;
      e.preventDefault();
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      form.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      const first = form.querySelector<HTMLInputElement>("input:not([type=hidden]):not([tabindex='-1']), textarea");
      window.setTimeout(() => first?.focus({ preventScroll: true }), reduce ? 0 : 600);
    }}
  >
    {children}
  </Link>
);
