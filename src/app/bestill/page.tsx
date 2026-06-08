import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nettbestilling midlertidig nede — Milano Bardufoss",
  description:
    "Nettbestillingen er midlertidig utilgjengelig. Ring oss for å bestille henting i mellomtiden.",
  alternates: { canonical: "/bestill" },
  robots: { index: false, follow: false },
};

export default function OrderPage() {
  return (
    <div className="bg-background">
      <section className="container-page py-16 sm:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3.5 py-1.5 text-sm font-semibold ring-1 ring-primary/20 mb-6">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Midlertidig nede
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground text-balance">
            Nettbestillingen er midlertidig utilgjengelig
          </h1>
          <p className="mt-5 text-lg text-muted-foreground text-balance">
            Vi har en teknisk feil og jobber med å fikse det så raskt vi kan. Beklager bryet!
          </p>
          <p className="mt-3 text-muted-foreground text-balance">
            I mellomtiden tar vi gjerne imot bestillinger på telefon.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:+4791929910"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
            >
              Ring oss
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-base font-semibold text-foreground hover:bg-stone-100 transition"
            >
              Til forsiden
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
