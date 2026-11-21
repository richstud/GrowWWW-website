import { ServicePage } from "@/components/ServicePage";
import { SeoDemo } from "@/components/home/ServiceBento";

export default function DigitalMarketing() {
  return (
    <ServicePage
      path="/services/digital-marketing"
      demo={<SeoDemo />}
      formService="SEO & Google ranking"
      formHeading="Tell us who you want to reach"
      extra={{
        title: "Channels we run",
        rows: [
          { name: "SEO", text: "Technical fixes, keyword research, content and links so you rank for what you sell." },
          { name: "Google Maps", text: "Google Business Profile, local pages and reviews for 'near me' searches." },
          { name: "Google Ads", text: "Search, display and YouTube campaigns with call and form tracking." },
          { name: "Meta ads", text: "Instagram and Facebook campaigns built for leads and sales." },
          { name: "Email & WhatsApp", text: "Newsletters, offers and follow-ups that bring customers back." },
          { name: "Reporting", text: "A monthly report of calls, enquiries and rankings - in plain language." },
        ],
      }}
    />
  );
}
