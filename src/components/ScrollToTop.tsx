import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scrolls to the top when the page changes (React Router keeps the old scroll position otherwise). */
export const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);
  return null;
};
