import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock } from "lucide-react";
import { formatOpeningHoursTable } from "@/lib/opening-hours";
import type { OpeningHour } from "@/lib/lettbestilt";

const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2293.5!2d18.5060!3d69.046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x45db19000dad9a07%3A0x6de6e6d1e9debbed!2sMilano!5e0!3m2!1sno!2sno";

export function LocationBlock({ openingHours }: { openingHours: OpeningHour[] }) {
  const hours = formatOpeningHoursTable(openingHours);
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container-page grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">
            Her finner du oss
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground text-balance mb-6">
            Sulten? Vi står klare.
          </h2>

          <ul className="space-y-5 text-foreground mb-8">
            <li className="flex gap-3">
              <MapPin className="h-5 w-5 mt-0.5 shrink-0 text-secondary" />
              <div>
                <div className="font-medium">Rustahøgdveien 16</div>
                <div className="text-muted-foreground text-sm">9325 Bardufoss</div>
              </div>
            </li>
            <li className="flex gap-3">
              <Phone className="h-5 w-5 mt-0.5 shrink-0 text-secondary" />
              <a
                href="tel:+4791929910"
                className="font-medium hover:text-secondary"
              >
                91 92 99 10
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="h-5 w-5 mt-0.5 shrink-0 text-secondary" />
              <div className="grow">
                <div className="font-medium mb-2">Åpningstider</div>
                <div className="grid grid-cols-2 gap-y-1 text-sm text-muted-foreground max-w-xs">
                  {hours.map((h) => (
                    <span key={h.day} className="contents">
                      <span>{h.day}</span>
                      <span className="text-right">{h.label}</span>
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground/70 mt-2">
                  Kjøkkenet stenger for nettbestilling kl. 21
                </p>
              </div>
            </li>
          </ul>

          <Button asChild size="lg" className="text-base h-12 px-7 motion-safe:active:scale-[0.97] motion-safe:transition-transform">
            <Link href="/bestill">Bestill maten her</Link>
          </Button>
        </div>

        <div className="relative aspect-square sm:aspect-[5/4] w-full rounded-2xl overflow-hidden ring-1 ring-border shadow-md">
          <iframe
            src={MAP_EMBED_SRC}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Milano Bardufoss på kart"
            className="h-full w-full"
          />
        </div>
      </div>
    </section>
  );
}
