import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { PageHero, primaryBtn, secondaryBtn } from "@/components/PageHero";
import { InlineContactForm } from "@/components/InlineContactForm";
import { Seo } from "@/components/Seo";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { QuoteLink } from "@/components/QuoteLink";
import { youTubeId } from "@/lib/youtube";

/** Description pasted in the admin: blank lines split paragraphs, lines starting with "-" or "•" become bullets. */
function PlainText({ text }: { text: string }) {
  const blocks = text.replace(/\r/g, "").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-foreground/85">
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        if (lines.every((l) => /^\s*[-•*]\s+/.test(l))) {
          return (
            <ul key={i} className="space-y-2">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-3"><span className="mt-[0.7em] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />{l.replace(/^\s*[-•*]\s+/, "")}</li>
              ))}
            </ul>
          );
        }
        return <p key={i} className="whitespace-pre-line">{b}</p>;
      })}
    </div>
  );
}

function VideoPlayer({ url }: { url: string }) {
  const yt = youTubeId(url);
  if (yt) {
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${yt}?rel=0`}
          title="Product video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) {
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden">
        <iframe
          className="w-full h-full"
          src={`https://player.vimeo.com/video/${vimeo[1]}`}
          title="Product video"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <video controls className="w-full rounded-lg" src={url}>
      Your browser does not support the video tag.
    </video>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: product, isLoading, isSuccess } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("slug", slug!).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={product ? `${product.name.trim()} | GrowWWW` : "Product | GrowWWW"}
        description={product?.short_description || "Software products from GrowWWW for growing businesses."}
        canonicalPath={slug ? `/products/${slug}` : "/products"}
        // Only mark as noindex when the lookup worked and the product really doesn't exist.
        // A failed or slow request (e.g. while Google renders the page) must not hide a real product.
        noindex={isSuccess && !product}
        schema={
          product
            ? [{
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: product.name.trim(),
                description: product.short_description || product.description || "",
                applicationCategory: "BusinessApplication",
                url: `https://www.growwww.in/products/${slug}`,
                publisher: { "@id": "https://www.growwww.in/#organization" },
              }]
            : []
        }
      />
      <Navbar />
      {isLoading ? (
        <div className="container mx-auto max-w-5xl px-4 pt-36">
          <div className="h-12 w-2/3 animate-pulse rounded bg-card" />
        </div>
      ) : !product ? (
        <PageHero title="Product not found" intro="It may have been renamed or removed." trail={[{ label: "Products", to: "/products" }]} actions={<Link to="/products" className={secondaryBtn}>See all products</Link>} />
      ) : (
        <>
          <PageHero
            title={product.name}
            intro={product.short_description || undefined}
            trail={[{ label: "Products", to: "/products" }]}
            current={product.name}
            actions={
              <>
                <QuoteLink className={primaryBtn}>Ask for a demo</QuoteLink>
                {product.cta_url && (
                  <a href={product.cta_url} target="_blank" rel="noopener noreferrer" className={secondaryBtn}>Try it</a>
                )}
                {product.price_label && <span className="text-sm text-muted-foreground sm:ml-2">{product.price_label}</span>}
              </>
            }
          />
          <section className="px-4 pb-16">
            <div className="container mx-auto max-w-5xl space-y-10">
              {product.video_url && (
                <div className="overflow-hidden rounded-[1.75rem] border border-border">
                  <VideoPlayer url={product.video_url} />
                </div>
              )}
              {!product.video_url && product.thumbnail_url && (
                <img src={product.thumbnail_url} alt={product.name} className="w-full rounded-[1.75rem] border border-border object-cover" />
              )}
              {product.description && (
                <PlainText text={product.description} />
              )}
            </div>
          </section>
        </>
      )}

      <section className="px-4">
        <div className="container mx-auto max-w-7xl">
          <InlineContactForm service={product?.name} heading="Interested in this product?" subheading="Tell us about your business - we'll reply within 24–48 hours." />
        </div>
      </section>
      <Footer />
    </div>
  );
}
