import type { Restaurant } from "./lettbestilt";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.milanobardufoss.no";

const JSON_LD_ESCAPE = new RegExp("[<>&\\u2028\\u2029]", "g");

export function jsonLdScript(value: unknown): string {
  return JSON.stringify(value).replace(
    JSON_LD_ESCAPE,
    (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"),
  );
}

const DAY_OF_WEEK_SCHEMA = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function restaurantJsonLd(r: Restaurant) {
  const loc = r.locations[0];
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}/#restaurant`,
    name: r.name,
    description:
      r.description ??
      "Pizza, grill og kebab i hjertet av Bardufoss. Bestill på nett, hent når du vil.",
    url: SITE_URL,
    telephone: r.phone ?? "+47 91 92 99 10",
    email: r.email ?? undefined,
    image: `${SITE_URL}/logo.png`,
    servesCuisine: r.cuisineType ?? "Pizza, kebab og grill",
    priceRange: "$$",
    address: loc
      ? {
          "@type": "PostalAddress",
          streetAddress: loc.address,
          postalCode: loc.postalCode,
          addressLocality: loc.city,
          addressCountry: loc.country,
        }
      : {
          "@type": "PostalAddress",
          streetAddress: "Rustahøgdveien 16",
          postalCode: "9325",
          addressLocality: "Bardufoss",
          addressCountry: "NO",
        },
    geo:
      loc?.latitude && loc?.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: loc.latitude,
            longitude: loc.longitude,
          }
        : undefined,
    openingHoursSpecification: r.openingHours
      .filter((h) => !h.isClosed)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: DAY_OF_WEEK_SCHEMA[h.dayOfWeek],
        opens: h.opensAt,
        closes: h.closesAt,
      })),
    acceptsReservations: true,
    hasMenu: `${SITE_URL}/bestill`,
    menu: `${SITE_URL}/bestill`,
    taxID: r.orgNumber ?? undefined,
    sameAs: r.googleReviewUrl ? [r.googleReviewUrl] : undefined,
  };
}
