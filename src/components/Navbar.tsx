import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { AnimatedLogo } from "./AnimatedLogo";
import { useSiteContent } from "@/lib/content";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const location = useLocation();
  const announcement = useSiteContent("announcement");

  const { data: products = [] } = useQuery({
    queryKey: ["products-nav"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, short_description")
        .eq("is_active", true)
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Products", href: "/products", hasDropdown: true },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50 pt-[env(safe-area-inset-top)]">
      {announcement.enabled && announcement.text && (
        <div className="bg-gradient-gold px-4 py-1.5 text-center text-xs font-medium text-primary-foreground">
          {announcement.link ? (
            <Link to={announcement.link} className="hover:underline">{announcement.text} →</Link>
          ) : (
            announcement.text
          )}
        </div>
      )}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <AnimatedLogo />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) =>
              item.hasDropdown ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger
                    className={`flex items-center gap-1 text-sm font-medium transition-colors outline-none ${
                      isActive(item.href) ? "text-primary" : "text-foreground hover:text-primary"
                    }`}
                  >
                    {item.name}
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64 bg-background border-border">
                    <DropdownMenuItem asChild>
                      <Link to="/products" className="cursor-pointer font-semibold text-primary">
                        All Products
                      </Link>
                    </DropdownMenuItem>
                    {products.length === 0 && (
                      <div className="px-2 py-2 text-xs text-muted-foreground">No products yet</div>
                    )}
                    {products.map((p) => (
                      <DropdownMenuItem key={p.id} asChild>
                        <Link to={`/products/${p.slug}`} className="cursor-pointer flex flex-col items-start">
                          <span className="font-medium">{p.name}</span>
                          {p.short_description && (
                            <span className="text-xs text-muted-foreground truncate max-w-full">
                              {p.short_description}
                            </span>
                          )}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.href) ? "text-primary" : "text-foreground hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          <div className="hidden lg:block">
            <Link to="/contact" className="inline-flex items-center rounded-full border border-primary px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
              Get a quote
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-1 max-h-[calc(100dvh-5rem)] overflow-y-auto">
            {navigation.map((item) =>
              item.hasDropdown ? (
                <div key={item.name}>
                  <button
                    onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href) ? "text-primary bg-primary/10" : "text-foreground hover:text-primary"
                    }`}
                  >
                    {item.name}
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileProductsOpen && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-border pl-3">
                      <Link
                        to="/products"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm text-primary font-semibold"
                      >
                        All Products
                      </Link>
                      {products.map((p) => (
                        <Link
                          key={p.id}
                          to={`/products/${p.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 py-2 text-sm text-foreground hover:text-primary"
                        >
                          {p.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive(item.href) ? "text-primary bg-primary/10" : "text-foreground hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
            <div className="px-4 pt-2">
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
                Get a quote
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
