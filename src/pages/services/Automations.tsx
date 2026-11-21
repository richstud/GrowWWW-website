import { ServicePage } from "@/components/ServicePage";
import { AutomationDemo } from "@/components/home/ServiceBento";

export default function Automations() {
  return (
    <ServicePage
      path="/services/automations"
      demo={<AutomationDemo />}
      formService="AI & business automation"
      formHeading="Tell us what eats up your team's time"
      extra={{
        title: "Where automation pays off first",
        intro: "Start with the task your team repeats every day. Most clients save hours a week from the first automation.",
        rows: [
          { name: "Sales & CRM", text: "Capture leads from every source, assign them and send follow-ups automatically." },
          { name: "Customer service", text: "WhatsApp auto-replies, chatbots and ticket routing." },
          { name: "Finance & accounts", text: "Quotations, invoices, payment reminders and daily reports." },
          { name: "E-commerce", text: "Order confirmations, stock updates and delivery notifications." },
          { name: "HR & onboarding", text: "Offer letters, onboarding checklists and attendance summaries." },
        ],
      }}
    />
  );
}
