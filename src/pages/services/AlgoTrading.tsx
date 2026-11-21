import { ServicePage } from "@/components/ServicePage";
import { AlgoDemo } from "@/components/home/AlgoDemo";

export default function AlgoTrading() {
  return (
    <ServicePage
      path="/services/algo-trading"
      demo={<AlgoDemo />}
      formService="Algo trading software"
      formHeading="Tell us about the strategy you want automated"
      extra={{
        title: "Brokers and tools we work with",
        intro: "Your strategy runs through your own broker account using its official API. You stay in control of the account and the money in it.",
        rows: [
          { name: "Indian brokers", text: "Zerodha Kite Connect, Upstox, Angel One SmartAPI, Dhan, Fyers and other brokers with an official API." },
          { name: "International", text: "Interactive Brokers, Alpaca and crypto exchange APIs such as Binance and Delta Exchange." },
          { name: "Charts & signals", text: "TradingView alerts and Pine Script, Amibroker and Python indicators turned into automatic orders." },
          { name: "Hosting", text: "Runs 24x7 on a cloud server (VPS) close to the exchange, with automatic restarts and daily logs." },
          { name: "Alerts & reports", text: "Every signal, order and exit sent to Telegram, plus a daily profit and loss report." },
        ],
      }}
      note="We build the software and set it up for you. We don't give investment advice or promise returns - trading involves risk, and the strategy decisions are yours. Bots for Indian markets are set up to follow SEBI's rules for retail algo trading through your broker."
    />
  );
}
