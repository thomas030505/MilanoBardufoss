"use client";

import { useEffect } from "react";
import { useAttributionStore } from "@/store/attribution";

// Leser ?lb_campaign=<id> fra landingslenken (LettBestilt-kampanje-e-post) og
// lagrer den (30 dager) slik at en påfølgende bestilling eller reservasjon
// attribueres til kampanjen. Rendrer ingenting — mountes i root-layouten.
export function AttributionCapture() {
  const capture = useAttributionStore((s) => s.capture);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("lb_campaign");
    if (id) capture(id);
  }, [capture]);
  return null;
}
