import type { HoursOverride, OpeningHour } from "./lettbestilt";

const TZ = "Europe/Oslo";

function osloParts(date: Date) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(date).map((p) => [p.type, p.value])
  );
  const weekdayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  return {
    iso: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: parseInt(parts.hour, 10) * 60 + parseInt(parts.minute, 10),
    dayOfWeek: weekdayMap[parts.weekday] ?? 0,
  };
}

function hhmmToMinutes(s: string): number {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + (m ?? 0);
}

export type RestaurantStatus = {
  isOpen: boolean;
  closesAt: string | null;
  opensAt: string | null;
  nextOpenLabel: string | null;
};

export function getRestaurantStatus(
  hours: OpeningHour[],
  overrides: HoursOverride[],
  now: Date = new Date()
): RestaurantStatus {
  const { iso, minutes, dayOfWeek } = osloParts(now);

  const todayOverride = overrides.find(
    (o) => iso >= o.startDate.slice(0, 10) && iso <= o.endDate.slice(0, 10)
  );

  let opensAt: string | null = null;
  let closesAt: string | null = null;
  let isClosed = false;

  if (todayOverride) {
    isClosed = todayOverride.isClosed;
    opensAt = todayOverride.opensAt;
    closesAt = todayOverride.closesAt;
  } else {
    const today = hours.find((h) => h.dayOfWeek === dayOfWeek);
    if (!today || today.isClosed) {
      isClosed = true;
    } else {
      opensAt = today.opensAt;
      closesAt = today.closesAt;
    }
  }

  if (!isClosed && opensAt && closesAt) {
    const open = hhmmToMinutes(opensAt);
    const close = hhmmToMinutes(closesAt);
    if (minutes >= open && minutes < close) {
      return { isOpen: true, closesAt, opensAt, nextOpenLabel: null };
    }
  }

  // Find next open day
  for (let i = 0; i < 7; i++) {
    const d = (dayOfWeek + i) % 7;
    const h = hours.find((x) => x.dayOfWeek === d);
    if (h && !h.isClosed) {
      if (i === 0 && opensAt && minutes < hhmmToMinutes(opensAt)) {
        return {
          isOpen: false,
          closesAt: null,
          opensAt,
          nextOpenLabel: `Åpner ${opensAt}`,
        };
      }
      if (i > 0) {
        const dayName = ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"][d];
        const label = i === 1 ? `Åpner i morgen ${h.opensAt}` : `Åpner ${dayName} ${h.opensAt}`;
        return { isOpen: false, closesAt: null, opensAt: h.opensAt, nextOpenLabel: label };
      }
    }
  }
  return { isOpen: false, closesAt: null, opensAt: null, nextOpenLabel: null };
}

const DAY_NAMES_NB = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];

export function formatOpeningHoursTable(hours: OpeningHour[]) {
  const order = [1, 2, 3, 4, 5, 6, 0];
  return order.map((d) => {
    const h = hours.find((x) => x.dayOfWeek === d);
    return {
      day: DAY_NAMES_NB[d],
      label: !h || h.isClosed ? "Stengt" : `${h.opensAt}–${h.closesAt}`,
    };
  });
}

/**
 * Online ordering closes 1 hour before kitchen close.
 * Returns true if orders can still be placed right now.
 */
export function isOrderingOpen(
  hours: OpeningHour[],
  overrides: HoursOverride[],
  cutoffMinutesBeforeClose = 60,
  now: Date = new Date()
): boolean {
  const status = getRestaurantStatus(hours, overrides, now);
  if (!status.isOpen || !status.closesAt) return false;
  const { minutes } = osloParts(now);
  const close = hhmmToMinutes(status.closesAt);
  return minutes < close - cutoffMinutesBeforeClose;
}
