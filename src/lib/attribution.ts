// Kampanje-attribusjon — delt logikk mellom capture-store (klient) og
// proxy-routene (server). Når en kunde lander via en LettBestilt-kampanjelenke
// (?lb_campaign=<id>) lagres id-en i nettleseren og følger med til ordren/
// reservasjonen, slik at kjøpet attribueres til kampanjen på tvers av siten.

// Attribusjonsvindu — matcher LettBestilt sitt 30-dagers vindu.
export const ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

// localStorage-nøkkel (egen, ikke i cart-store — overlever clear() av kurven).
export const ATTRIBUTION_STORAGE_KEY = "milano-attribution";

// LettBestilt-kampanje-IDer er Prisma-cuid (v1): starter med 'c', kun [a-z0-9],
// 25 tegn. /api/v1/orders validerer feltet med z.string().cuid() — sender vi en
// tuklet/ugyldig ?lb_campaign videre, gir det 422 og BLOKKERER bestillingen.
// Derfor validerer vi formen før vi capturer og før vi forwarder: en ugyldig
// verdi droppes stille (ingen attribusjon) i stedet for å knekke kjøpet.
const CAMPAIGN_ID_RE = /^c[a-z0-9]{8,63}$/i;

export function isLikelyCampaignId(value: unknown): value is string {
  return typeof value === "string" && CAMPAIGN_ID_RE.test(value);
}
