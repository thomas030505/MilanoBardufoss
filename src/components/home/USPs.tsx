import { ChefHat, UtensilsCrossed, Users } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const USPS = [
  {
    icon: ChefHat,
    title: "Pizza, grill og kebab — alt på ett sted",
    body:
      "Italiensk pizza ved siden av biffsnadder, kebab og burgere. Vi lager alt du kan tenke deg, så du finner noe alle blir fornøyde med.",
  },
  {
    icon: UtensilsCrossed,
    title: "Porsjoner du blir mett av",
    body:
      "Du får mye mat for pengene — det er det gjestene oftest nevner. Vi vil at du skal gå derfra mett, ikke skuffet.",
  },
  {
    icon: Users,
    title: "Et sted for hele familien",
    body:
      "Barnestolen står klar, menyen har noe for alle aldre, og vi tar oss tid til å hjelpe hvis du er usikker.",
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
            Mat folk kommer tilbake for.
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
