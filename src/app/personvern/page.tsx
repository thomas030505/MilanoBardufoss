import type { Metadata } from "next";
import Link from "next/link";
import { fetchMenu } from "@/lib/lettbestilt";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Personvern",
  description:
    "Slik behandler vi personopplysninger ved bestilling, bordreservasjon og nyhetsbrev.",
  alternates: { canonical: "/personvern" },
};

const LAST_UPDATED = "2026-05-31";

export default async function PersonvernPage() {
  const menu = await fetchMenu({ revalidate: 60 }).catch(() => null);
  const r = menu?.restaurant;
  const location = r?.locations?.[0];

  const name = r?.name ?? "Milano Bardufoss";
  const orgNumber = r?.orgNumber ?? "";
  const email = r?.email ?? "";
  const phone = r?.phone ?? "";
  const address = location?.address ?? "Rustahøgdveien 16";
  const postal = `${location?.postalCode ?? "9325"} ${location?.city ?? "Bardufoss"}`.trim();

  return (
    <div className="container-page max-w-[820px] py-14 md:py-16 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-3">
        Personvern
      </p>
      <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground mb-3">
        Personvernerklæring
      </h1>
      <p className="text-sm text-muted-foreground mb-10">
        Sist oppdatert {LAST_UPDATED}
      </p>

      <div className="space-y-10 text-base leading-relaxed text-foreground">
        <Section title="Behandlingsansvarlig">
          <p>
            {name}
            {orgNumber ? `, org.nr. ${orgNumber}` : ""}
            {address ? `, ${address}` : ""}
            {postal ? `, ${postal}` : ""}.
          </p>
          {(email || phone) && (
            <p>
              Spørsmål om personvern:{" "}
              {email && (
                <a
                  className="font-semibold text-secondary underline underline-offset-2"
                  href={`mailto:${email}`}
                >
                  {email}
                </a>
              )}
              {email && phone ? " eller " : ""}
              {phone && (
                <a
                  className="font-semibold text-secondary underline underline-offset-2"
                  href={`tel:${phone.replace(/\s/g, "")}`}
                >
                  {phone}
                </a>
              )}
              .
            </p>
          )}
        </Section>

        <Section title="Hva vi samler inn">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Bestillinger:</strong> navn, telefon, e-post, ordreinnhold og
              henteinformasjon. Brukes for å levere maten du har bestilt.
            </li>
            <li>
              <strong>Bordreservasjoner:</strong> navn, telefon, e-post, dato,
              tidspunkt og antall gjester. Brukes for å holde av bord og bekrefte
              reservasjonen.
            </li>
            <li>
              <strong>Nyhetsbrev:</strong> e-post og tidspunkt for samtykke. Lagres
              kun hvis du selv melder deg på popupen.
            </li>
            <li>
              <strong>Funksjonelle cookies / localStorage:</strong> handlekurven din
              og om du har lukket informasjonsbanneret. Disse lagres lokalt i
              nettleseren og deles ikke med oss.
            </li>
            <li>
              <strong>Anonym besøksstatistikk:</strong> Vercel Analytics måler antall
              besøk og hvilke sider som leses, uten å identifisere enkeltbrukere og
              uten cookies.
            </li>
          </ul>
        </Section>

        <Section title="Hjemmel">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Avtale (GDPR art. 6(1)(b)):</strong> behandling av bestillinger
              og bordreservasjoner.
            </li>
            <li>
              <strong>Samtykke (GDPR art. 6(1)(a)):</strong> påmelding til
              nyhetsbrev. Du kan trekke samtykket når som helst.
            </li>
            <li>
              <strong>Berettiget interesse (GDPR art. 6(1)(f)):</strong> drift og
              forbedring av nettsiden, og anonym besøksstatistikk.
            </li>
            <li>
              <strong>Rettslig forpliktelse (GDPR art. 6(1)(c)):</strong> oppbevaring
              av regnskaps- og kvitteringsdata etter bokføringsloven.
            </li>
          </ul>
        </Section>

        <Section title="Hvem vi deler data med">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>LettBestilt</strong> (Tace IT AS) er vår databehandler og
              leverer bestillings-, reservasjons- og nyhetsbrev-systemet.
            </li>
            <li>
              <strong>Vercel Inc.</strong> hoster nettsiden og leverer cookie-fri,
              anonymisert besøksstatistikk.
            </li>
            <li>
              <strong>Stripe</strong> behandler kortbetalinger hvis du betaler på
              nett. Stripe er selvstendig behandlingsansvarlig for betalingsdataene.
            </li>
          </ul>
          <p>
            Vi selger aldri personopplysninger og deler dem ikke med tredjepart
            utover det som er nødvendig for å levere tjenesten.
          </p>
        </Section>

        <Section title="Lagringstid">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Bestillinger og kvitteringer: lagres i opptil 5 år for å oppfylle
              bokføringsloven.
            </li>
            <li>Bordreservasjoner: slettes innen 90 dager etter besøket.</li>
            <li>
              Nyhetsbrev: lagres til du melder deg av. Avmelding kan gjøres i hver
              e-post du mottar, eller ved å kontakte oss.
            </li>
          </ul>
        </Section>

        <Section title="Dine rettigheter">
          <p>
            Etter personopplysningsloven og GDPR har du rett til innsyn (art. 15),
            retting (art. 16), sletting (art. 17), begrensning (art. 18),
            dataportabilitet (art. 20) og innsigelse (art. 21). Kontakt oss for å
            bruke rettighetene dine. Du har også rett til å klage til{" "}
            <a
              className="font-semibold text-secondary underline underline-offset-2"
              href="https://www.datatilsynet.no"
              target="_blank"
              rel="noopener noreferrer"
            >
              Datatilsynet
            </a>
            .
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            Vi setter ingen sporings-cookies. Nettsiden bruker localStorage for å
            huske handlekurven din og om du har lukket informasjonsbanneret.
            Besøksstatistikken fra Vercel er cookie-fri og kan ikke knyttes til
            enkeltbrukere.
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
