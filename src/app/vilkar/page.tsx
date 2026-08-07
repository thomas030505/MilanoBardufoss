import type { Metadata } from "next";
import Link from "next/link";
import { fetchMenu } from "@/lib/lettbestilt";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Vilkår",
  description:
    "Salgs- og kjøpsvilkår for bestilling av mat: betaling, henting og levering, angrerett og reklamasjon.",
  alternates: { canonical: "/vilkar" },
};

const LAST_UPDATED = "2026-08-07";

export default async function VilkarPage() {
  const menu = await fetchMenu({ revalidate: 60 }).catch(() => null);
  const r = menu?.restaurant;
  const location = r?.locations?.[0];

  const name = r?.name ?? "Milano Bardufoss";
  const orgNumber = r?.orgNumber ?? "";
  const email = r?.email ?? "";
  const phone = r?.phone ?? "";
  const address = location?.address ?? "Rustahøgdveien 16";
  const postal = `${location?.postalCode ?? "9325"} ${location?.city ?? "Bardufoss"}`.trim();

  // Speil de faktiske valgene fra LettBestilt — aldri lov bort noe kassen ikke tilbyr.
  // Alle tre feiler LUKKET (`=== true`): faller API-kallet, er det bedre å utelate en
  // betalingsmåte vi ikke er sikre på enn å love kunden noe kassen vil avvise.
  const acceptsOnline = r?.payment?.card === true || r?.payment?.vipps === true;
  const acceptsCash = r?.payment?.cash === true;
  const hasDelivery = r?.deliveryEnabled === true;

  const telHref = phone ? `tel:${phone.replace(/\s/g, "")}` : null;

  return (
    <div className="container-page max-w-[820px] py-14 md:py-16 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-3">
        Vilkår
      </p>
      <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground mb-3">
        Salgs- og kjøpsvilkår
      </h1>
      <p className="text-sm text-muted-foreground mb-10">
        Sist oppdatert {LAST_UPDATED}
      </p>

      <div className="space-y-10 text-base leading-relaxed text-foreground">
        <Section title="Hvem du handler med">
          <p>
            Selger og din avtalemotpart er {name}
            {orgNumber ? `, org.nr. ${orgNumber}` : ""}
            {address ? `, ${address}` : ""}
            {postal ? `, ${postal}` : ""}.
          </p>
          <p>
            Bestillingsløsningen leveres teknisk av LettBestilt AS. LettBestilt er ikke part i
            kjøpet — maten, prisene, åpningstidene og leveringen er {name} sitt ansvar.
          </p>
          {(email || phone) && (
            <p>
              Kontakt oss:{" "}
              {email && (
                <a
                  className="font-semibold text-secondary underline underline-offset-2"
                  href={`mailto:${email}`}
                >
                  {email}
                </a>
              )}
              {email && phone ? " eller " : ""}
              {telHref && (
                <a
                  className="font-semibold text-secondary underline underline-offset-2"
                  href={telHref}
                >
                  {phone}
                </a>
              )}
              .
            </p>
          )}
        </Section>

        <Section title="Bestilling og når avtalen er bindende">
          <p>
            Bestillingen er bindende når du har fullført kassen og mottatt bekreftelse — på
            skjermen, på e-post eller begge. Bekreftelsen viser hva du har bestilt, totalbeløpet
            og når maten er klar.
          </p>
          <p>
            Vi tar forbehold om å avvise eller kansellere en bestilling ved åpenbare pris- eller
            skrivefeil, ved manglende varer, eller hvis vi er stengt på det oppgitte tidspunktet.
            Er bestillingen betalt, refunderes hele beløpet.
          </p>
        </Section>

        <Section title="Priser">
          <p>
            Alle priser er oppgitt i norske kroner inkludert merverdiavgift. Prisen som vises i
            kassen når du bekrefter bestillingen, er prisen som gjelder. Eventuelt leveringsgebyr
            og minstebeløp vises før du betaler.
          </p>
        </Section>

        <Section title="Betaling">
          <ul className="list-disc pl-5 space-y-2">
            {acceptsOnline && (
              <li>
                <strong>Betaling på nett:</strong> gjennomføres på en sikker betalingsside hos
                SagaPay. Vi lagrer aldri kortopplysningene dine. Beløpet trekkes når du
                fullfører bestillingen.
              </li>
            )}
            {acceptsCash && (
              <li>
                <strong>Betaling ved henting:</strong> du betaler i kassen når du henter.
                Bestillingen er like bindende.
              </li>
            )}
          </ul>
          <p>
            Hvilke betalingsmåter som er tilgjengelige, vises i kassen. Blir en betaling avvist,
            opprettes ingen bestilling.
          </p>
        </Section>

        <Section title={hasDelivery ? "Henting og levering" : "Henting"}>
          <p>
            Oppgitt klartid er et estimat. Ved uventet stor pågang kan det ta noe lengre tid; vi
            tar kontakt hvis avviket blir vesentlig.
          </p>
          {hasDelivery && (
            <p>
              Vi leverer til adressene som dekkes av leveringsområdet i kassen. Oppgi riktig
              adresse og et telefonnummer vi kan nå deg på. Er du ikke tilgjengelig ved levering,
              og vi ikke får tak i deg, regnes bestillingen som levert.
            </p>
          )}
          <p>
            Mat som ikke hentes innen rimelig tid etter avtalt tidspunkt, kastes av hensyn til
            mattryggheten, og beløpet refunderes ikke.
          </p>
        </Section>

        <Section title="Angrerett">
          <p>
            Angrerettloven gir normalt 14 dagers angrerett ved netthandel, men{" "}
            <strong>tilberedt mat og ferskvarer er unntatt</strong>. Unntaket følger av
            angrerettloven § 22 — varer som raskt forringes eller går ut på dato, og tjenester
            knyttet til matservering til et bestemt tidspunkt.
          </p>
          <p>
            Du kan derfor ikke angre en matbestilling etter at den er bekreftet. Du kan fortsatt
            avbestille etter avsnittet under, og du har full reklamasjonsrett hvis noe er feil.
          </p>
        </Section>

        <Section title="Avbestilling og endring">
          <p>
            Trenger du å endre eller avbestille, ring oss så raskt som mulig
            {telHref ? (
              <>
                {" "}på{" "}
                <a
                  className="font-semibold text-secondary underline underline-offset-2"
                  href={telHref}
                >
                  {phone}
                </a>
              </>
            ) : null}
            . Har vi ikke begynt å tilberede maten, avbestiller vi kostnadsfritt og refunderer et
            eventuelt forhåndsbetalt beløp. Er tilberedningen påbegynt, kan vi ikke refundere.
          </p>
          <p>
            Refusjoner går tilbake til samme betalingsmiddel og tar normalt 2–10 virkedager.
          </p>
        </Section>

        <Section title="Hvis noe er feil">
          <p>
            Får du feil vare, manglende varer eller mat som ikke holder mål, kontakt oss samme
            dag — da kan vi rette det opp med en ny leveranse eller refusjon. Rettighetene dine
            som forbruker etter forbrukerkjøpsloven gjelder uansett.
          </p>
        </Section>

        <Section title="Allergener">
          <p>
            Allergenmerkingen i menyen følger EUs 14 allergengrupper og oppdateres av oss.
            Kjøkkenet håndterer flere allergener i samme lokale, så vi kan ikke garantere at en
            rett er helt fri for spor. Har du en alvorlig allergi, kontakt oss før du bestiller.
          </p>
        </Section>

        <Section title="Ansvar">
          <p>
            Vi er ansvarlige for at maten holder avtalt kvalitet og leveres som bestilt. Vi er
            ikke ansvarlige for indirekte tap, og heller ikke for forsinkelser som skyldes
            forhold utenfor vår kontroll. Ansvaret er uansett begrenset til bestillingens beløp.
            Dette begrenser ikke ufravikelige forbrukerrettigheter.
          </p>
        </Section>

        <Section title="Personvern">
          <p>
            Hvordan vi behandler personopplysningene dine står i{" "}
            <Link
              className="font-semibold text-secondary underline underline-offset-2"
              href="/personvern"
            >
              personvernerklæringen
            </Link>
            .
          </p>
        </Section>

        <Section title="Lovvalg og tvister">
          <p>
            Norsk rett gjelder. Er du uenig i noe, ta kontakt med oss først — de aller fleste
            sakene løser seg der. Kommer vi ikke i mål, kan du bringe saken inn for{" "}
            <a
              className="font-semibold text-secondary underline underline-offset-2"
              href="https://www.forbrukerradet.no"
              target="_blank"
              rel="noopener noreferrer"
            >
              Forbrukerrådet
            </a>{" "}
            for mekling.
          </p>
        </Section>
      </div>

      <div className="mt-14 pt-8 border-t border-border">
        <Link
          href="/kontakt"
          className="inline-flex items-center gap-2 text-sm font-semibold text-secondary underline underline-offset-2"
        >
          Har du spørsmål? Kontakt oss
        </Link>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-3">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
