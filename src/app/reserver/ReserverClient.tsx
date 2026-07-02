"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Loader2,
  Mail,
  Phone,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { DineInAvailability, DineInSlot } from "@/lib/lettbestilt";
import { useAttributionStore } from "@/store/attribution";
import { toE164Norwegian, formatNorwegianPhoneDisplay, telHref } from "@/lib/phone";

type Props = {
  restaurantPhone: string | null;
  locationId: string | undefined;
};

type Step = 1 | 2;

type Confirmation = {
  orderNumber: number;
  publicToken: string;
  dineInAt: string;
  partySize: number;
};

function todayYmdOslo(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Oslo" }).format(new Date());
}

function ymdPlusDaysOslo(daysAhead: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + daysAhead);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Oslo" }).format(d);
}

function formatOsloDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat("nb-NO", {
    timeZone: "Europe/Oslo",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(d);
  const time = new Intl.DateTimeFormat("nb-NO", {
    timeZone: "Europe/Oslo",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
  return { date, time };
}

export function ReserverClient({ restaurantPhone, locationId }: Props) {
  const [step, setStep] = useState<Step>(1);

  // Step 1 — When
  const minDate = useMemo(() => todayYmdOslo(), []);
  const maxDate = useMemo(() => ymdPlusDaysOslo(30), []);
  const [date, setDate] = useState<string>(() => todayYmdOslo());
  const [partySize, setPartySize] = useState(2);
  const [maxPartySize, setMaxPartySize] = useState(8);
  const [slots, setSlots] = useState<DineInSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<DineInSlot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [dineInDisabled, setDineInDisabled] = useState(false);

  // Step 2 — Details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [consent, setConsent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const refetchSeq = useRef(0);
  const refetchSlots = useCallback(
    async (signal: AbortSignal) => {
      setLoadingSlots(true);
      try {
        const params = new URLSearchParams({
          date,
          partySize: String(partySize),
        });
        const res = await fetch(`/api/dine-in/availability?${params}`, { signal });
        const data = (await res.json()) as DineInAvailability;
        if (data?.enabled === true) {
          setMaxPartySize(data.maxPartySize);
          if (partySize > data.maxPartySize) setPartySize(data.maxPartySize);
          setSlots(data.slots);
          setSelectedSlot((prev) => {
            const stillAvailable = prev && data.slots.find(
              (s) => s.iso === prev.iso && s.available,
            );
            if (stillAvailable) return stillAvailable;
            return null;
          });
          setDineInDisabled(false);
        } else {
          setSlots([]);
          setSelectedSlot(null);
          setDineInDisabled(true);
        }
      } catch (e) {
        if ((e as { name?: string })?.name === "AbortError") return;
        setSlots([]);
        setSelectedSlot(null);
      } finally {
        setLoadingSlots(false);
      }
    },
    [date, partySize],
  );

  useEffect(() => {
    if (step !== 1) return;
    const ctrl = new AbortController();
    const mySeq = ++refetchSeq.current;
    const t = setTimeout(() => {
      if (mySeq !== refetchSeq.current) return;
      void refetchSlots(ctrl.signal);
    }, 200);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [step, refetchSlots]);

  function goNext() {
    if (step === 1) {
      if (!selectedSlot) {
        toast.error("Velg et tidspunkt før du fortsetter");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!name.trim()) return toast.error("Skriv inn navn");
      if (!phone.trim()) return toast.error("Skriv inn telefonnummer");
      const phoneE164 = toE164Norwegian(phone);
      if (!phoneE164) return toast.error("Telefonnummer må ha 8 siffer");
      if (!email.trim()) return toast.error("Skriv inn e-post");
      if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
        return toast.error("Ugyldig e-postadresse");
      }
      if (!consent) return toast.error("Du må godta vilkårene");
      void submitReservation();
    }
  }
  function goBack() {
    if (step === 2) setStep(1);
  }

  async function submitReservation() {
    if (submitting) return;
    if (!selectedSlot) {
      setStep(1);
      return;
    }
    setSubmitting(true);
    try {
      const phoneE164 = toE164Norwegian(phone);
      // Kampanje-attribusjon: lest ved submit så TTL-en vurderes i
      // bestillingsøyeblikket. null → feltet utelates helt fra payloaden.
      const attributedCampaignId =
        useAttributionStore.getState().getValidCampaignId() ?? undefined;
      const body = {
        locationId,
        dineInAt: selectedSlot.iso,
        partySize,
        guestName: name.trim(),
        guestPhone: phoneE164,
        guestEmail: email.trim(),
        note: note.trim() || undefined,
        marketingOptIn: marketingOptIn || undefined,
        consentGivenAt: marketingOptIn ? new Date().toISOString() : undefined,
        locale: "nb" as const,
        ...(attributedCampaignId ? { attributedCampaignId } : {}),
      };
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": `reservation-${crypto.randomUUID()}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        handleReservationError(data);
        return;
      }
      setConfirmation({
        orderNumber: data.orderNumber,
        publicToken: data.publicToken,
        dineInAt: data.dineInAt,
        partySize: data.partySize,
      });
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      toast.error("Noe gikk galt. Prøv igjen.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleReservationError(data: {
    error?: { message?: string; code?: string; upstream?: number };
  }) {
    const upstream = data?.error?.upstream;
    const code = data?.error?.code;
    const msg = data?.error?.message ?? "Reservasjon feilet. Prøv igjen.";
    if (code === "NO_TABLE" || upstream === 409) {
      toast.error("Bordet ble akkurat tatt. Velg et annet tidspunkt.");
      setStep(1);
      const ctrl = new AbortController();
      void refetchSlots(ctrl.signal);
      return;
    }
    if (code === "DINE_IN_DISABLED") {
      toast.error(
        "Bordreservasjon er midlertidig deaktivert" +
          (restaurantPhone ? `. Ring oss på ${formatNorwegianPhoneDisplay(restaurantPhone)}` : ""),
      );
      return;
    }
    if (code === "PARTY_TOO_LARGE") {
      toast.error(msg);
      setStep(1);
      return;
    }
    toast.error(msg);
  }

  // ────────────── Confirmation screen ──────────────
  if (confirmation) {
    const { date: dateLabel, time } = formatOsloDateTime(confirmation.dineInAt);
    const trackingUrl = `${process.env.NEXT_PUBLIC_LETTBESTILT_URL ?? "https://lettbestilt.no"}/order/${confirmation.publicToken}`;
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
          <div className="container-page py-10 sm:py-14 relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/15 text-secondary mb-5 ring-1 ring-secondary/25">
              <Clock className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1 w-8 rounded-full bg-primary" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Mottatt
              </p>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground text-balance max-w-3xl">
              Takk for forespørselen
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Vi har mottatt forespørselen din og tar kontakt så snart vi har bekreftet bordet —
              vanligvis innen kort tid. Du får bekreftelse på e-post når det er klart.
            </p>
          </div>
        </section>

        <div className="container-page py-10 sm:py-14">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10 mb-8">
            {confirmation.orderNumber > 0 && (
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                  Forespørsel
                </dt>
                <dd className="font-display text-3xl tabular-nums text-secondary">
                  #{confirmation.orderNumber}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                Gjester
              </dt>
              <dd className="font-display text-3xl tabular-nums text-foreground">
                {confirmation.partySize}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                Tidspunkt
              </dt>
              <dd className="text-xl text-foreground">
                <span className="capitalize">{dateLabel}</span> kl.{" "}
                <span className="tabular-nums">{time}</span>
              </dd>
            </div>
          </dl>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg">
              <a href={trackingUrl} target="_blank" rel="noopener noreferrer">
                Se sporing
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">Tilbake til forsiden</Link>
            </Button>
          </div>

          {restaurantPhone && (
            <p className="text-sm text-muted-foreground mt-8">
              Trenger du å endre eller avbestille? Ring oss på{" "}
              <a href={telHref(restaurantPhone)} className="text-secondary font-medium hover:underline">
                {formatNorwegianPhoneDisplay(restaurantPhone)}
              </a>
              .
            </p>
          )}
        </div>
      </div>
    );
  }

  // ────────────── Wizard ──────────────
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
              Reserver bord
            </p>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground text-balance max-w-3xl">
            Sikre deg et bord hos Milano
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Velg dag, tid og antall gjester. Vi bekrefter forespørselen på e-post så snart bordet
            er klart.
          </p>
        </div>
      </section>

      <div className="container-page py-8 sm:py-12">
        <StepProgress current={step} />

        {step === 1 && (
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <SectionEyebrow num="01">Når vil du reservere bord?</SectionEyebrow>
            <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-6">
              Velg dag og tid.
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="res-date" className="mb-1.5 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-secondary" />
                  Dato
                </Label>
                <Input
                  id="res-date"
                  type="date"
                  value={date}
                  min={minDate}
                  max={maxDate}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="res-party" className="mb-1.5 flex items-center gap-2">
                  <Users className="h-4 w-4 text-secondary" />
                  Antall gjester
                </Label>
                <select
                  id="res-party"
                  value={partySize}
                  onChange={(e) => setPartySize(Number(e.target.value))}
                  className="flex h-11 w-full rounded-md border border-input bg-card px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                >
                  {Array.from(
                    { length: Math.max(maxPartySize, partySize) },
                    (_, i) => i + 1,
                  ).map((n) => (
                    <option key={n} value={n} disabled={n > maxPartySize}>
                      {n} {n === 1 ? "gjest" : "gjester"}
                      {n > maxPartySize ? " (over kapasitet)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-2">
              <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-3">
                <Clock className="inline-block h-3.5 w-3.5 mr-1.5 -mt-0.5" strokeWidth={1.5} />
                Ledige tider
              </span>
              {loadingSlots ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-6">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Henter ledige tider …
                </div>
              ) : dineInDisabled ? (
                <div className="rounded-lg border border-dashed border-border bg-stone-100/60 p-5 text-center">
                  <p className="text-sm text-muted-foreground">
                    Bordreservasjon er ikke tilgjengelig akkurat nå.
                    {restaurantPhone && (
                      <>
                        {" "}Ring oss på{" "}
                        <a
                          href={telHref(restaurantPhone)}
                          className="text-secondary font-medium hover:underline"
                        >
                          {formatNorwegianPhoneDisplay(restaurantPhone)}
                        </a>
                        .
                      </>
                    )}
                  </p>
                </div>
              ) : slots.length === 0 || slots.every((s) => !s.available) ? (
                <div className="rounded-lg border border-dashed border-border bg-stone-100/60 p-5 text-center">
                  <p className="text-sm text-foreground mb-1">Ingen ledige tider denne dagen.</p>
                  <p className="text-xs text-muted-foreground">
                    Prøv en annen dag eller juster antall gjester.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2">
                  {slots.map((s) => {
                    const isSelected = selectedSlot?.iso === s.iso;
                    return (
                      <button
                        key={s.iso}
                        type="button"
                        onClick={() => s.available && setSelectedSlot(s)}
                        disabled={!s.available}
                        aria-pressed={isSelected}
                        className={
                          "flex flex-col items-center justify-center gap-0.5 rounded-md border px-2 py-3 font-display text-base transition-colors " +
                          (isSelected
                            ? "border-secondary bg-secondary text-secondary-foreground ring-2 ring-secondary"
                            : "border-border bg-card text-foreground hover:border-secondary/60") +
                          (s.available ? " cursor-pointer" : " opacity-40 cursor-not-allowed")
                        }
                      >
                        <span className="tabular-nums">{s.time}</span>
                        {!s.available && (
                          <span className="font-sans text-[10px] uppercase tracking-wider text-muted-foreground">
                            Fullt
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                type="button"
                size="lg"
                onClick={goNext}
                disabled={!selectedSlot}
                className="motion-safe:active:scale-[0.98] motion-safe:transition-transform"
              >
                Fortsett
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <SectionEyebrow num="02">Detaljer</SectionEyebrow>
            <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-2">
              Si litt om deg selv.
            </h2>
            {selectedSlot && (
              <p className="text-sm text-muted-foreground mb-6">
                <span className="capitalize">{formatOsloDateTime(selectedSlot.iso).date}</span>{" "}
                kl.{" "}
                <span className="tabular-nums">{formatOsloDateTime(selectedSlot.iso).time}</span>{" "}
                · {partySize} {partySize === 1 ? "gjest" : "gjester"}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="ml-3 text-secondary text-xs uppercase tracking-wider hover:underline"
                >
                  Endre
                </button>
              </p>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="res-name" className="mb-1.5 flex items-center gap-2">
                  <User className="h-4 w-4 text-secondary" />
                  Navn *
                </Label>
                <Input
                  id="res-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Fullt navn"
                  autoComplete="name"
                  maxLength={100}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="res-phone" className="mb-1.5 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-secondary" />
                    Telefon *
                  </Label>
                  <Input
                    id="res-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 8))}
                    required
                    placeholder="8 siffer"
                    autoComplete="tel"
                    inputMode="numeric"
                    maxLength={8}
                  />
                </div>
                <div>
                  <Label htmlFor="res-email" className="mb-1.5 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-secondary" />
                    E-post *
                  </Label>
                  <Input
                    id="res-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="navn@eksempel.no"
                    autoComplete="email"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="res-note" className="mb-1.5">
                  Beskjed (valgfritt)
                </Label>
                <Textarea
                  id="res-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Bursdagsfeiring, allergier, ønske om vindusbord …"
                  rows={3}
                  maxLength={300}
                />
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <label className="flex items-start gap-3 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={marketingOptIn}
                  onChange={(e) => setMarketingOptIn(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-secondary"
                />
                <span className="text-muted-foreground leading-relaxed">
                  Ja takk, jeg vil ha nyheter og tilbud fra Milano Bardufoss på e-post.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                  className="mt-1 h-4 w-4 accent-secondary"
                />
                <span className="text-muted-foreground leading-relaxed">
                  Jeg godtar at Milano Bardufoss behandler mine kontaktopplysninger for å
                  gjennomføre reservasjonen.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground hover:text-secondary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Tilbake
              </button>
              <Button
                type="button"
                size="lg"
                onClick={goNext}
                disabled={submitting}
                className="motion-safe:active:scale-[0.98] motion-safe:transition-transform"
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Send forespørsel
                    <Check className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function StepProgress({ current }: { current: Step }) {
  const labels: Array<{ label: string; n: Step }> = [
    { label: "Når", n: 1 },
    { label: "Detaljer", n: 2 },
  ];
  return (
    <ol className="grid grid-cols-2 gap-2 mb-6" aria-label="Reservasjon – steg">
      {labels.map(({ label, n }) => {
        const state = n < current ? "done" : n === current ? "current" : "pending";
        return (
          <li
            key={label}
            className={
              "flex items-center gap-3 rounded-lg border p-3 transition-colors " +
              (state === "current"
                ? "border-secondary bg-secondary/5"
                : state === "done"
                ? "border-secondary/40 bg-card"
                : "border-border bg-card opacity-60")
            }
          >
            <span
              className={
                "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-display tabular-nums " +
                (state === "current"
                  ? "bg-secondary text-secondary-foreground"
                  : state === "done"
                  ? "bg-secondary/70 text-secondary-foreground"
                  : "bg-muted text-muted-foreground")
              }
            >
              {state === "done" ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : `0${n}`}
            </span>
            <span
              className={
                "text-xs uppercase tracking-[0.14em] " +
                (state === "pending" ? "text-muted-foreground" : "text-foreground")
              }
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function SectionEyebrow({ num, children }: { num: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="font-display text-secondary tabular-nums tracking-wider text-sm">
        {num}
      </span>
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {children}
      </span>
    </div>
  );
}
