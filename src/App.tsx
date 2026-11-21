import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import WebDesign from "./pages/services/WebDesign";
import SoftwareSolutions from "./pages/services/SoftwareSolutions";
import Automations from "./pages/services/Automations";
import DigitalMarketing from "./pages/services/DigitalMarketing";
import AlgoTrading from "./pages/services/AlgoTrading";
import NotFound from "./pages/NotFound";
import PortfolioDetail from "./pages/PortfolioDetail";
import LocationPage from "./pages/LocationPage";
import { Analytics } from "./components/Analytics";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { ScrollToTop } from "./components/ScrollToTop";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } });

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Analytics />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
          <Route path="/web-design-company-mumbai" element={<LocationPage />} />
          <Route path="/web-design-company-navi-mumbai" element={<LocationPage />} />
          <Route path="/web-design-company-lucknow" element={<LocationPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/web-design" element={<WebDesign />} />
          <Route path="/services/software-solutions" element={<SoftwareSolutions />} />
          <Route path="/services/automations" element={<Automations />} />
          <Route path="/services/digital-marketing" element={<DigitalMarketing />} />
          <Route path="/services/algo-trading" element={<AlgoTrading />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <WhatsAppButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
