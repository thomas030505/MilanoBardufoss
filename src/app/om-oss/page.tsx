import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Leaf, Clock, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Om oss — Milano Bardufoss",
  description:
    "Milano Bardufoss serverer pizza, grillmat og kebab i Rustahøgdveien 16. Les mer om stedet, åpningstider og henting.",
  alternates: { canonical: "/om-oss" },
};

const PROMISES = [
  {
    icon: Leaf,
    title: "Gode råvarer",
    body:
      "En Margherita har bare tre ingredienser, så de må være bra. Det smaker du.",
  },
  {
    icon: Clock,
    title: "Klar når vi har sagt",
    body:
      "Bestiller du henting, står maten klar på avtalt tid. Vi vet du har andre ting å rekke.",
  },
  {
    icon: Heart,
    title: "Hjemmekoselig atmosfære",
    body:
      "Hos oss er det uformelt og hyggelig. Barnestolen står klar, og vi behandler gjestene våre som naboer, ikke bare kunder.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-background">
      <section className="relative h-[55vh] min-h-[380px] max-h-[600px] overflow-hidden">
        <Image
          src="/venue-outside.avif"
          alt="Milano Bardufoss fasade"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/40 to-charcoal/30" />
        <div className="absolute inset-0 grid items-end">
          <div className="container-page pb-12 sm:pb-16 text-cream">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/80 mb-3">
              Om Milano Bardufoss
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-balance max-w-3xl">
              Pizza, grill og kebab i Bardufoss.
            </h1>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-page max-w-3xl">
          <p className="text-xl sm:text-2xl text-foreground/90 leading-relaxed text-balance">
            Milano er et fast stopp for mange her i Bardufoss. Vi har holdt på lenge nok til å
            vite at det ikke trenger å være komplisert: pizzaen skal være god, biffen skal
            være mør, og porsjonen skal være stor nok til å mette etter en lang dag.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-stone-100/60">
        <div className="container-page">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">
            Slik jobber vi
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-foreground mb-12 text-balance max-w-2xl">
            Tre ting som er viktig for oss.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {PROMISES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl bg-card p-7 border border-border"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-secondary/10 text-secondary mb-5">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-2xl text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[5/4] rounded-2xl overflow-hidden ring-1 ring-border shadow-md">
            <Image
              src="/venue-inside.webp"
              alt="Milano Bardufoss interiør"
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-display text-4xl sm:text-5xl text-foreground mb-5 text-balance">
              Stikk innom — eller bestill og hent.
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Du finner oss i Rustahøgdveien 16, fem minutter fra sentrum. Sett deg ned hos
              oss, eller ta maten med hjem.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-7">
              Skal du bestille til jobben, bursdagen eller turen? Ring oss, så ordner vi det.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/bestill">Bestill henting</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border">
                <Link href="/kontakt">Kontakt oss</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
