import Image from "next/image";
import Link from "next/link";
import { fetchMenu, FALLBACK_MENU } from "@/lib/lettbestilt";
import { formatOpeningHoursTable } from "@/lib/opening-hours";
import { formatNorwegianPhoneDisplay, telHref } from "@/lib/phone";

export async function Footer() {
  // Kontaktinfo fra LettBestilt-API-et; FALLBACK_MENU (kjent adresse/telefon/
  // åpningstider) når API-et er nede. Fail open — footeren rendrer alltid.
  let restaurant = FALLBACK_MENU.restaurant;
  try {
    const data = await fetchMenu({ cache: "no-store" });
    restaurant = data.restaurant;
  } catch {
    // Fail open — footer renders with fallback data
  }
  const orgNumber = restaurant.orgNumber;
  const hours = formatOpeningHoursTable(restaurant.openingHours);
  // API-et returnerer ikke lenger locations (avdelinger fjernet i LettBestilt);
  // adressen kommer fra fallbacken til den ev. dukker opp i API-et igjen.
  const loc = restaurant.locations[0] ?? FALLBACK_MENU.restaurant.locations[0];
  const phone = restaurant.phone ?? FALLBACK_MENU.restaurant.phone;

  return (
    <footer className="mt-24 border-t border-border bg-stone-100 text-foreground">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Image
            src="/logo.png"
            alt="Milano Bardufoss"
            width={160}
            height={56}
            className="h-12 w-auto"
          />
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Pizza, grill og kebab i {loc.address}, {loc.city}.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-secondary mb-3">
            Sider
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/bestill" className="hover:text-secondary">Bestill</Link></li>
            <li><Link href="/reserver" className="hover:text-secondary">Reserver bord</Link></li>
            <li><Link href="/om-oss" className="hover:text-secondary">Om oss</Link></li>
            <li><Link href="/kontakt" className="hover:text-secondary">Kontakt</Link></li>
            <li><Link href="/vilkar" className="hover:text-secondary">Vilkår</Link></li>
            <li><Link href="/personvern" className="hover:text-secondary">Personvern</Link></li>
            <li className="pt-1">
              <a
                href="https://lettbestilt.no"
                className="text-muted-foreground hover:text-secondary"
                target="_blank"
                rel="noreferrer"
              >
                Nettbestilling via LettBestilt →
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-secondary mb-3">
            Besøk oss
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>{loc.address}</li>
            <li>
              {loc.postalCode} {loc.city}
            </li>
            <li>
              <a href={telHref(phone)} className="hover:text-secondary">
                {formatNorwegianPhoneDisplay(phone)}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-secondary mb-3">
            Åpningstider
          </h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {hours.length > 0 ? (
              hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-4">
                  <span>{h.day}</span>
                  <span>{h.label}</span>
                </li>
              ))
            ) : (
              <li>Hver dag 13–22</li>
            )}
            <li className="text-xs text-muted-foreground/70 pt-2">
              Nettbestillingen stenger kl. 21.
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col sm:flex-row justify-between items-center gap-2 py-6 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Milano Bardufoss
            {orgNumber ? ` — Org.nr ${orgNumber}` : ""}
          </p>
          <p>
            Drevet av{" "}
            <a
              href="https://lettbestilt.no"
              className="hover:text-secondary"
              target="_blank"
              rel="noreferrer"
            >
              LettBestilt.no
            </a>
            <br />
            Utviklet av {" "}
            <a
              href="https://taceit.no"
              className="hover:text-secondary"
              target="_blank"
              rel="noreferrer"
            >
              TaceIT.no
            </a>

          </p>
          
        </div>
      </div>
    </footer>
  );
}
