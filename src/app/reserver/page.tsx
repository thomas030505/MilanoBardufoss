import type { Metadata } from "next";
import { fetchMenu } from "@/lib/lettbestilt";
import { ReserverClient } from "./ReserverClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Reserver bord",
  description:
    "Reserver bord hos Milano Bardufoss. Send forespørsel — vi bekrefter på e-post så snart bordet er klart.",
  alternates: { canonical: "/reserver" },
};

export default async function ReserverPage() {
  const menu = await fetchMenu();
  return (
    <ReserverClient
      restaurantPhone={menu.restaurant.phone}
      locationId={menu.restaurant.locations[0]?.id}
    />
  );
}
