# Milano Bardufoss — nettside

Next.js 15 + Tailwind v4 + shadcn/ui. Integrert med [LettBestilt](https://lettbestilt.no) v1 API for nettbestilling. Pickup-only.

## Lokal utvikling

```bash
cp .env.example .env.local
npm install
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000).

## Env-variabler

| Var | Verdi | Hvor |
|---|---|---|
| `NEXT_PUBLIC_LETTBESTILT_URL` | `https://lettbestilt.no` | klient + server |
| `NEXT_PUBLIC_SLUG` | `milano` | klient + server |
| `NEXT_PUBLIC_SITE_URL` | `https://milanobardufoss.no` | klient + server (SEO/canonical) |
| `NEXT_PUBLIC_STRIPE_ENABLED` | `true` eller `false` | klient |
| `LETTBESTILT_API_KEY` | (valgfritt) | server only — kun fallback |

## Deploy

1. Push til GitHub
2. Importer i Vercel — sett alle `NEXT_PUBLIC_*`-vars
3. Pek `milanobardufoss.no` (CNAME) på Vercel
4. **Tace IT må:** legge `https://milanobardufoss.no` + `https://www.milanobardufoss.no` i LettBestilts `PUBLIC_API_ALLOWED_ORIGINS`-env-variabel — uten dette feiler nettbestilling fra browser

## Struktur

```
src/
├── app/                     # Sider (App Router)
│   ├── page.tsx             # Forsiden
│   ├── bestill/             # Order flow
│   ├── meny/                # Lese-meny
│   ├── om-oss/
│   ├── kontakt/
│   ├── order/[token]/       # Redirect til lettbestilt.no/order/...
│   ├── layout.tsx           # Header + Footer + fonts + metadata
│   ├── globals.css          # Brand tokens (cream/basil/tomato/...)
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── layout/              # Header, Footer
│   ├── home/                # Hero, USPs, PopularDishes, AboutTeaser, ReviewsSlider, LocationBlock
│   ├── order/               # OrderClient, ProductCard, ProductDialog, CartSheet, CheckoutForm
│   └── ui/                  # shadcn primitives
├── lib/
│   ├── lettbestilt.ts       # API-klient + typer
│   ├── money.ts             # formatMoney
│   ├── opening-hours.ts     # isRestaurantOpen, formatOpeningHoursTable
│   └── seo.ts               # JSON-LD Restaurant schema
└── store/
    └── cart.ts              # Zustand handlekurv (persisted)
```

## Endre tekst og farger

- **Forsiden / om-oss / kontakt copy** — direkte i `src/app/<rute>/page.tsx` eller komponentene under `src/components/home/`
- **Reviews** — `src/components/home/ReviewsSlider.tsx` (`REVIEWS`-array)
- **Brand-farger og typografi** — `src/app/globals.css`
- **Logo, venue-bilder** — bytt ut filene under `public/`
- **SEO-metadata** — `src/app/layout.tsx` (default) og hver `page.tsx` har eget `metadata`-export

## Bygg og test

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Test bestillingsflyten end-to-end mot live API før deploy.

---

Built av Tace IT 🍕
