import { fetchMenu, FALLBACK_MENU } from "@/lib/lettbestilt";
import { getRestaurantStatus } from "@/lib/opening-hours";
import { Hero } from "@/components/home/Hero";
import { USPs } from "@/components/home/USPs";
import { PopularDishes } from "@/components/home/PopularDishes";
import { Gallery } from "@/components/home/Gallery";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { ReviewsSlider } from "@/components/home/ReviewsSlider";
import { LocationBlock } from "@/components/home/LocationBlock";
import { jsonLdScript, restaurantJsonLd } from "@/lib/seo";

export const revalidate = 60;

export default async function HomePage() {
  const data = await fetchMenu().catch(() => FALLBACK_MENU);
  const popular = data.categories
    .flatMap((c) => c.products)
    .filter((p) => p.isPopular)
    .slice(0, 6);
  // Pad to 6 if fewer than 6 popular flagged
  if (popular.length < 6) {
    const seen = new Set(popular.map((p) => p.id));
    for (const c of data.categories) {
      for (const p of c.products) {
        if (popular.length >= 6) break;
        if (!seen.has(p.id) && p.isRecommended) {
          popular.push(p);
          seen.add(p.id);
        }
      }
      if (popular.length >= 6) break;
    }
  }
  const status = getRestaurantStatus(
    data.restaurant.openingHours,
    data.restaurant.hoursOverrides
  );
  const openLabel = status.isOpen
    ? `Åpent nå · stenger ${status.closesAt}`
    : status.nextOpenLabel;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(restaurantJsonLd(data.restaurant)),
        }}
      />
      <Hero openLabel={openLabel} />
      <USPs />
      <PopularDishes products={popular} />
      <Gallery />
      <AboutTeaser />
      <ReviewsSlider />
      <LocationBlock openingHours={data.restaurant.openingHours} />
    </>
  );
}
