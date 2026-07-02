"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ATTRIBUTION_STORAGE_KEY,
  ATTRIBUTION_TTL_MS,
  isLikelyCampaignId,
} from "@/lib/attribution";

// Kampanje-attribusjon på kundesiden: når kunden lander via en kampanjelenke
// (?lb_campaign=<id>), lagres id-en her og følger med til ordren/reservasjonen
// ved checkout. Egen persist-nøkkel (IKKE cart-storen) så den overlever
// kurv-tømming, og utløper etter 30 dager.

interface AttributionStore {
  campaignId: string | null;
  capturedAt: number | null;
  capture: (id: string) => void;
  getValidCampaignId: () => string | null;
  clear: () => void;
}

export const useAttributionStore = create<AttributionStore>()(
  persist(
    (set, get) => ({
      campaignId: null,
      capturedAt: null,
      capture: (id) => {
        if (!isLikelyCampaignId(id)) return;
        set({ campaignId: id, capturedAt: Date.now() });
      },
      getValidCampaignId: () => {
        const { campaignId, capturedAt } = get();
        if (!campaignId || !capturedAt) return null;
        if (Date.now() - capturedAt > ATTRIBUTION_TTL_MS) return null;
        return campaignId;
      },
      clear: () => set({ campaignId: null, capturedAt: null }),
    }),
    {
      name: ATTRIBUTION_STORAGE_KEY,
      partialize: (s) => ({ campaignId: s.campaignId, capturedAt: s.capturedAt }),
    },
  ),
);
