import type { Metadata } from "next";
import { fetchMenu } from "@/lib/lettbestilt";
import { getRestaurantStatus, isOrderingOpen } from "@/lib/opening-hours";
import { OrderClient } from "@/components/order/OrderClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bestill — Henting fra Milano Bardufoss",
  description:
    "Bestill pizza, kebab og grill til henting fra Milano Bardufoss. Maten står klar når du kommer.",
  alternates: { canonical: "/bestill" },
};

export default async function OrderPage() {
  const data = await fetchMenu({ cache: "no-store" });
  const status = getRestaurantStatus(
    data.restaurant.openingHours,
    data.restaurant.hoursOverrides
  );
  const orderingOpen = isOrderingOpen(
    data.restaurant.openingHours,
    data.restaurant.hoursOverrides
  );
  const closedReason = !status.isOpen
    ? status.nextOpenLabel ?? "Vi har stengt akkurat nå."
    : !orderingOpen
    ? "Nettbestillingen er stengt — vi tar imot nye bestillinger fram til én time før stengetid."
    : null;

  const primaryLocation = data.restaurant.locations[0];
  const primaryLocationLabel = (() => {
    if (!primaryLocation) return null;
    const street = primaryLocation.address?.trim();
    if (street && street.length > 1 && !/^x+$/i.test(street)) return street;
    const cityLine = [primaryLocation.postalCode, primaryLocation.city]
      .filter(Boolean)
      .join(" ");
    return cityLine || primaryLocation.name;
  })();

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/8 via-stone-100/60 to-secondary/8">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--color-charcoal) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="container-page py-8 sm:py-12 lg:py-14 relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-1 w-8 rounded-full bg-primary" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Bestill henting
            </p>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground text-balance max-w-3xl">
            Bestill henting fra Milano
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Velg fra menyen under. Du får bekreftelse på e-post, og vi lager maten klar til
            avtalt tid.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {orderingOpen ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary/12 text-secondary px-3.5 py-1.5 text-sm font-semibold ring-1 ring-secondary/20">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
                </span>
                Åpen for nettbestilling
              </span>
            ) : (
              closedReason && (
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3.5 py-1.5 text-sm font-medium ring-1 ring-primary/20">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {closedReason}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      <OrderClient data={data} orderingOpen={orderingOpen} closedReason={closedReason} />
    </div>
  );
}
