import type { Metadata } from "next";
import { Phone, MapPin, Clock, Mail } from "lucide-react";
import { fetchMenu } from "@/lib/lettbestilt";
import { formatOpeningHoursTable } from "@/lib/opening-hours";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Kontakt — Milano Bardufoss",
  description:
    "Kontakt Milano Bardufoss på 91 92 99 10. Adresse: Rustahøgdveien 16, 9325 Bardufoss. Åpent hver dag 13–22.",
  alternates: { canonical: "/kontakt" },
};

const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2293.5!2d18.5060!3d69.046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x45db19000dad9a07%3A0x6de6e6d1e9debbed!2sMilano!5e0!3m2!1sno!2sno";

export default async function ContactPage() {
  const data = await fetchMenu().catch(() => null);
  const hours = data
    ? formatOpeningHoursTable(data.restaurant.openingHours)
    : [];
  const email = data?.restaurant.email ?? "Milano.fm9@gmail.com";

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-stone-100/60">
        <div className="container-page py-14 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">
            Kontakt
          </p>
          <h1 className="font-display text-5xl sm:text-6xl text-foreground text-balance max-w-3xl">
            Lurer du på noe?
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
            Ring oss gjerne hvis du har spørsmål om allergener, ønsker å legge inn en stor
            bestilling til jobben, eller vil reservere bord. Vi tar alltid telefonen!
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-page grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-7">
            <ContactRow
              icon={Phone}
              label="Telefon"
              value={
                <a
                  href="tel:+4791929910"
                  className="text-2xl font-display text-foreground hover:text-secondary"
                >
                  91 92 99 10
                </a>
              }
            />
            <ContactRow
              icon={MapPin}
              label="Adresse"
              value={
                <div className="text-foreground">
                  <div className="font-medium">Rustahøgdveien 16</div>
                  <div className="text-muted-foreground">9325 Bardufoss</div>
                </div>
              }
            />
            <ContactRow
              icon={Mail}
              label="E-post"
              value={
                <a
                  href={`mailto:${email}`}
                  className="text-foreground hover:text-secondary break-all"
                >
                  {email}
                </a>
              }
            />
            <ContactRow
              icon={Clock}
              label="Åpningstider"
              value={
                <div className="grid grid-cols-2 gap-y-1 max-w-xs text-sm">
                  {hours.length > 0 ? (
                    hours.map((h) => (
                      <span key={h.day} className="contents">
                        <span className="text-foreground">{h.day}</span>
                        <span className="text-muted-foreground text-right">{h.label}</span>
                      </span>
                    ))
                  ) : (
                    <span className="contents">
                      <span className="text-foreground">Hver dag</span>
                      <span className="text-muted-foreground text-right">13–22</span>
                    </span>
                  )}
                  <p className="col-span-2 text-xs text-muted-foreground/70 pt-2">
                    Kjøkkenet stenger for nettbestilling kl. 21
                  </p>
                </div>
              }
            />
          </div>

          <div className="relative aspect-square sm:aspect-[5/4] rounded-2xl overflow-hidden ring-1 ring-border shadow-md">
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
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          {label}
        </div>
        {value}
      </div>
    </div>
  );
}
