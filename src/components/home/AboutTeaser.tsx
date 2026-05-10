import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";

export function AboutTeaser() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container-page grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
        <Reveal className="relative aspect-[5/4] rounded-2xl overflow-hidden ring-1 ring-border shadow-md order-last lg:order-first">
          <Image
            src="/venue-inside.webp"
            alt="Milano Bardufoss interiør"
            fill
            sizes="(max-width: 1024px) 90vw, 45vw"
            className="object-cover motion-safe:transition-transform motion-safe:duration-700 hover:scale-[1.03]"
          />
        </Reveal>
        <Reveal delay={120}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">
            Om Milano Bardufoss
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground text-balance mb-5">
            En lokal favoritt rett ved veien.
          </h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            Du finner oss i Rustahøgdveien 16, fem minutter fra sentrum. Vi lager pizza,
            grillmat og kebab fra bunnen — og pizzaen er det folk oftest skryter av. Som{" "}
            <em>Berg</em> skrev i en anmeldelse:
          </p>
          <blockquote className="border-l-4 border-primary pl-4 my-6 font-display text-2xl text-foreground italic text-balance">
            {"«Best pizza I've got in this world.»"}
          </blockquote>
          <p className="text-foreground/80 leading-relaxed mb-7">
            Sett deg ned hos oss, eller bestill og ta med hjem.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <Button asChild size="lg" className="motion-safe:active:scale-[0.97] motion-safe:transition-transform">
              <Link href="/om-oss">Les hele historien</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-foreground">
              <Link href="/bestill">Bestill henting →</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
