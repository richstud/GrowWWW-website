import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { PageHero, secondaryBtn } from "@/components/PageHero";

const suggestions = [
  { to: "/services/web-design", label: "Website design" },
  { to: "/services/software-solutions", label: "Apps & software" },
  { to: "/services/automations", label: "Automation" },
  { to: "/services/digital-marketing", label: "Digital marketing" },
  { to: "/services/algo-trading", label: "Algo trading software" },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Page not found | GrowWWW" description="This page doesn't exist." noindex />
      <Navbar />
      <PageHero
        title="This page doesn't exist"
        intro="The link may be old or mistyped. Here are some places to start instead:"
        actions={
          <>
            {suggestions.map((sg) => (
              <Link key={sg.to} to={sg.to} className={secondaryBtn}>{sg.label}</Link>
            ))}
          </>
        }
      >
        <Link to="/" className="mt-8 inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </PageHero>
      <Footer />
    </div>
  );
};

export default NotFound;
