import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  placeReservationServer,
  LettBestiltError,
  type CreateReservationInput,
} from "@/lib/lettbestilt";

const ReservationSchema = z.object({
  locationId: z.string().optional(),
  dineInAt: z.string().datetime(),
  partySize: z.number().int().min(1).max(50),
  guestName: z.string().min(1).max(200),
  guestPhone: z.string().regex(/^\+\d{8,15}$/).optional(),
  guestEmail: z.string().email().optional(),
  note: z.string().max(500).optional(),
  marketingOptIn: z.boolean().optional(),
  consentGivenAt: z.string().datetime().optional(),
  locale: z.enum(["nb", "en"]).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: { message: "Ugyldig JSON" } }, { status: 400 });
  }

  const parsed = ReservationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { message: "Validering feilet", issues: parsed.error.issues } },
      { status: 400 },
    );
  }

  const idempotencyKey =
    req.headers.get("idempotency-key") ?? req.headers.get("Idempotency-Key") ?? crypto.randomUUID();

  try {
    const result = await placeReservationServer(
      parsed.data as CreateReservationInput,
      { idempotencyKey },
    );
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof LettBestiltError) {
      const status = e.status >= 400 && e.status < 500 ? e.status : 502;
      return NextResponse.json(
        { error: { message: e.message, code: e.code, upstream: e.status } },
        { status },
      );
    }
    console.error("[reservations] unexpected", e);
    return NextResponse.json(
      { error: { message: "Uventet feil. Prøv igjen." } },
      { status: 500 },
    );
  }
}
