import { ServicePage } from "@/components/ServicePage";
import { WebsiteDemo } from "@/components/home/ServiceBento";

export default function WebDesign() {
  return (
    <ServicePage
      path="/services/web-design"
      demo={<WebsiteDemo />}
      formService="Website design & development"
      formHeading="Tell us about your website"
      extra={{
        title: "Tools we build with",
        intro: "We pick the stack that fits your budget and how you'll update the site - not the one we like best.",
        rows: [
          { name: "Frontend", text: "React, Next.js, Vue.js, TypeScript, Tailwind CSS" },
          { name: "Backend", text: "Node.js, Python, PHP, Supabase" },
          { name: "Content & stores", text: "WordPress, Shopify, WooCommerce, headless CMS (Strapi, Sanity)" },
          { name: "Payments", text: "Razorpay, PhonePe, Stripe, Cashfree - UPI, cards and COD" },
        ],
      }}
    />
  );
}
