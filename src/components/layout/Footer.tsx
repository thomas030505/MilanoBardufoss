import Image from "next/image";
import Link from "next/link";
import { fetchMenu } from "@/lib/lettbestilt";
import { formatOpeningHoursTable } from "@/lib/opening-hours";

export async function Footer() {
  let orgNumber: string | null = null;
  let hours: ReturnType<typeof formatOpeningHoursTable> = [];
  try {
    const data = await fetchMenu({ cache: "no-store" });
    orgNumber = data.restaurant.orgNumber;
    hours = formatOpeningHoursTable(data.restaurant.openingHours);
  } catch {
    // Fail open — footer renders without dynamic data
  }

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
            Pizza, grill og kebab i Rustahøgdveien 16, Bardufoss.
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
            <li>Rustahøgdveien 16</li>
            <li>9325 Bardufoss</li>
            <li>
              <a href="tel:+4791929910" className="hover:text-secondary">
                91 92 99 10
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
