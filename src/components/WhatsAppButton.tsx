import { MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { seoConfig } from "@/components/Seo";

/** WhatsApp click-to-chat link with a pre-filled message. */
export const whatsappLink = (message = "Hi GrowWWW, I'd like to discuss a project.") =>
  `https://wa.me/${seoConfig.site.whatsapp}?text=${encodeURIComponent(message)}`;

/** Floating "Chat on WhatsApp" button shown on every public page. */
export const WhatsAppButton = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href={whatsappLink(`Hi GrowWWW, I found you on your website (${pathname}). I'd like to discuss a project.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with GrowWWW on WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] pl-4 pr-5 py-3 text-sm font-semibold text-[#06260f] shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366] opacity-60 animate-ping [animation-duration:2.5s]" aria-hidden />
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  );
};
