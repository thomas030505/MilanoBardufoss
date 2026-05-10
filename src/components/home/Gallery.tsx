import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";

const PHOTOS = [
  {
    src: "/gallery/durum_kebab.jpg",
    alt: "Hjemmelaget durum kebab med ferske grønnsaker",
    aspect: "aspect-[4/3] sm:aspect-[3/4]",
  },
  {
    src: "/gallery/kebabtallerken.jpg",
    alt: "Kebabtallerken med ris, pommes og fersk salat",
    aspect: "aspect-[4/3] sm:aspect-[3/4]",
  },
  {
    src: "/gallery/pizza.jpg",
    alt: "Nystekt Milano-pizza i pizzaboks",
    aspect: "aspect-[4/3] sm:aspect-[3/4]",
  },
];

export function Gallery() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-charcoal text-cream">
      <div className="container-page">
        <Reveal className="flex items-end justify-between gap-4 mb-10 sm:mb-12 flex-wrap">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px w-10 bg-primary" />
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Fra kjøkkenet
              </p>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-cream text-balance">
              Rett fra kjøkkenet vårt.
            </h2>
            <p className="mt-4 text-cream/70 max-w-xl">
              Bilder fra vårt eget kjøkken. Kom innom og se med dine egne øyne!
            </p>
          </div>
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm motion-safe:active:scale-[0.97] motion-safe:transition-transform"
          >
            <Link href="/bestill">Bestill nå →</Link>
          </Button>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {PHOTOS.map((p, i) => (
            <div
              key={p.src}
              className={`group relative ${p.aspect} overflow-hidden bg-stone-700 ${
                i === 1 ? "sm:translate-y-6" : ""
              }`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
