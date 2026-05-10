import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero({ openLabel }: { openLabel: string | null }) {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1800&q=80"
        alt="Milano pizza"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-charcoal/60" />

      <div className="relative z-10 text-center text-white px-5 sm:px-6 py-14 sm:py-20 lg:py-24 flex flex-col items-center gap-5 sm:gap-6 max-w-3xl mx-auto">
        {openLabel && (
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white px-4 py-1.5 text-sm font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-80" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
            </span>
            {openLabel}
          </div>
        )}

        <Image
          src="/logo.png"
          alt="Milano Bardufoss"
          width={600}
          height={210}
          priority
          className="h-32 sm:h-48 md:h-56 lg:h-64 w-auto drop-shadow-2xl motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-700"
        />

        <p className="text-sm sm:text-base font-semibold uppercase tracking-[0.2em] text-white/70">
          Pizza · Grill · Kebab
        </p>

        <p className="text-base sm:text-lg lg:text-xl text-white/90 text-balance leading-relaxed max-w-xl">
          Pizza, grill og kebab — laget når du bestiller. Bestill på nett og hent når det
          passer deg.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center pt-2 w-full sm:w-auto">
          <Button
            asChild
            size="lg"
            className="text-base px-8 h-13 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 motion-safe:active:scale-[0.97] motion-safe:transition-transform"
          >
            <Link href="/bestill">Bestill henting</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
