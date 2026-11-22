import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Home loads with the first file; every other page is downloaded only when someone opens it.
import Home from "./pages/Home";
import { Analytics } from "./components/Analytics";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { ScrollToTop } from "./components/ScrollToTop";

const About = lazy(() => import("./pages/About"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Services = lazy(() => import("./pages/Services"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const WebDesign = lazy(() => import("./pages/services/WebDesign"));
const SoftwareSolutions = lazy(() => import("./pages/services/SoftwareSolutions"));
const Automations = lazy(() => import("./pages/services/Automations"));
const DigitalMarketing = lazy(() => import("./pages/services/DigitalMarketing"));
const AlgoTrading = lazy(() => import("./pages/services/AlgoTrading"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PortfolioDetail = lazy(() => import("./pages/PortfolioDetail"));
const LocationPage = lazy(() => import("./pages/LocationPage"));

/** Same logo screen as the one in index.html, shown while a page's file downloads. */
const PageLoading = () => (
  <div className="fixed inset-0 bg-[#0a0a0a] bg-[url(/images/logo-loading.webp)] bg-[length:150px] bg-center bg-no-repeat" aria-label="Loading" />
);

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } });

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Analytics />
        <Suspense fallback={<PageLoading />}>
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
        </Suspense>
        <WhatsAppButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
