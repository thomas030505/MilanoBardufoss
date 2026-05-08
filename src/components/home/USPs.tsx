import { ChefHat, UtensilsCrossed, Users } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const USPS = [
  {
    icon: ChefHat,
    title: "Det beste fra to verdener",
    body:
      "Vi kombinerer italiensk tradisjon med norske favoritter. Enten du vil ha en deilig pizza eller saftig biffsnadder, så lager vi det fra bunnen av.",
  },
  {
    icon: UtensilsCrossed,
    title: "Porsjoner som metter",
    body:
      "Vi sparer ikke på råvarene. Det gjestene våre nevner oftest, er at du får mye god mat for pengene.",
  },
  {
    icon: Users,
    title: "Plass til hele familien",
    body:
      "Her er alle velkomne, ta med hele familien — alt fra unge til gamle.",
  },
];

export function USPs() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container-page">
        <Reveal className="max-w-2xl mb-10 sm:mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">
            Hvorfor velge Milano?
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground text-balance">
            Ærlig mat. Ingen snarveier.
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
          {USPS.map(({ icon: Icon, title, body }, i) => (
            <Reveal
              key={title}
              delay={i * 90}
              className="rounded-2xl border border-border bg-card p-6 sm:p-8 hover:border-secondary/40 hover:shadow-md motion-safe:hover:-translate-y-1 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-secondary/10 text-secondary mb-5">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-2xl text-foreground mb-2">{title}</h3>
              <p className="text-muted-foreground leading-relaxed">{body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
