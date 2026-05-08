"use client";

import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const REVIEWS = [
  {
    text: "Bestilte biffsnadder, noe av den beste jeg har spist. Mye mat for pengene — blir å spise der neste gang vi kjører forbi.",
    author: "Kristian Ø.",
  },
  {
    text: "God mat og hyggelig personale. Vi kom med baby, servitør kom med barnestol med en gang.",
    author: "Jelena S.",
  },
  {
    text: "Best pizza I've got in this world.",
    author: "Berg",
  },
  {
    text: "Bra pizza, hyggelig ansatte.",
    author: "Noah L. T.",
  },
];

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/place/Milano/@69.0460012,18.5037459,17z/data=!4m8!3m7!1s0x45db19000dad9a07:0x6de6e6d1e9debbed!8m2!3d69.0459994!4d18.5086168!9m1!1b1";

export function ReviewsSlider() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "center" });
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => embla?.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla?.scrollNext(), [embla]);
  const scrollTo = useCallback((i: number) => embla?.scrollTo(i), [embla]);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    onSelect();
    const id = setInterval(() => embla.scrollNext(), 6500);
    return () => {
      embla.off("select", onSelect);
      clearInterval(id);
    };
  }, [embla]);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-secondary text-secondary-foreground">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-foreground/70 mb-3">
            Anmeldelser
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-balance">
            Hva gjestene sier
          </h2>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {REVIEWS.map((r, i) => (
                <div
                  key={i}
                  className="min-w-0 flex-[0_0_100%] px-2"
                >
                  <figure className="rounded-2xl bg-secondary-foreground/5 border border-secondary-foreground/15 p-6 sm:p-10 text-center backdrop-blur-sm">
                    <div className="flex justify-center gap-0.5 mb-5 text-amber-300">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <blockquote className="font-display text-lg sm:text-2xl leading-relaxed text-balance">
                      «{r.text}»
                    </blockquote>
                    <figcaption className="mt-6 text-sm font-medium text-secondary-foreground/80">
                      — {r.author}
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={scrollPrev}
            aria-label="Forrige"
            className="absolute -left-2 sm:-left-12 top-1/2 -translate-y-1/2 text-secondary-foreground hover:bg-secondary-foreground/10 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollNext}
            aria-label="Neste"
            className="absolute -right-2 sm:-right-12 top-1/2 -translate-y-1/2 text-secondary-foreground hover:bg-secondary-foreground/10 rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          <div className="flex justify-center gap-2 mt-6">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Gå til anmeldelse ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  selected === i
                    ? "w-8 bg-secondary-foreground"
                    : "w-2 bg-secondary-foreground/40"
                }`}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium underline-offset-4 hover:underline text-secondary-foreground/90"
            >
              Les flere på Google →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
