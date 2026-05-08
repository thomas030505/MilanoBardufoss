import Link from "next/link";
import type { Product } from "@/lib/lettbestilt";
import { formatMoney } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export function PopularDishes({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-stone-100/60 border-y border-border">
      <div className="container-page">
        <Reveal className="flex items-end justify-between gap-4 mb-10 sm:mb-12 flex-wrap">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px w-10 bg-primary" />
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Hva står på menyen?
              </p>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground text-balance">
              Stort utvalg, samme kjærlighet til faget.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl">
              Vi har noe for enhver sult. Velg mellom alt fra en klassisk Margherita til vår
              egen Heggelia spesial. Er du mer i humør for kjøtt? Prøv indrefileten vår med
              peppersaus eller en klassisk kebab i pitabrød.
            </p>
          </div>
          <Button asChild variant="outline" className="border-foreground/20 motion-safe:active:scale-[0.97] motion-safe:transition-transform">
            <Link href="/bestill">Se hele menyen →</Link>
          </Button>
        </Reveal>

        {/* Typography-driven menu list — no images, classic restaurant menu styling */}
        <div className="grid sm:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-4 sm:gap-y-6">
          {products.map((p) => (
            <Link
              key={p.id}
              href="/bestill"
              className="group block py-3 border-b border-border/70 hover:border-primary/40 transition-colors motion-safe:active:scale-[0.99]"
            >
              <div className="flex items-baseline gap-2 sm:gap-3">
                <h3 className="font-display text-lg sm:text-xl text-foreground leading-snug">
                  {p.name}
                </h3>
                {p.isPopular && (
                  <span className="inline-flex items-center gap-1 rounded-sm bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                    <Flame className="h-3 w-3" /> Populær
                  </span>
                )}
                <span
                  aria-hidden
                  className="flex-1 mb-1 border-b border-dotted border-border group-hover:border-primary/40 transition-colors"
                />
                <span className="font-semibold text-foreground tabular-nums whitespace-nowrap">
                  {p.variants.length > 0 && (
                    <span className="text-xs uppercase tracking-wider text-muted-foreground mr-1">
                      Fra
                    </span>
                  )}
                  {formatMoney(minPrice(p))}
                </span>
              </div>
              {p.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2 max-w-md">
                  {p.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function minPrice(p: Product): number {
  if (p.variants.length === 0) return p.basePrice;
  return Math.min(...p.variants.map((v) => v.price));
}
