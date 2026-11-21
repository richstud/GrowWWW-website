import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Google Analytics 4. Set VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX in .env to turn it on.
// Records a page view on every route change and a "generate_lead" event when the enquiry form is sent.
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

export const Analytics = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!GA_ID || window.gtag) return;
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { send_page_view: false });
  }, []);

  useEffect(() => {
    if (!GA_ID || pathname.startsWith("/admin")) return;
    window.gtag?.("event", "page_view", { page_path: pathname, page_location: window.location.href, page_title: document.title });
  }, [pathname]);

  return null;
};
