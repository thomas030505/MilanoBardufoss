import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchDineInAvailabilityServer } from "@/lib/lettbestilt";

const QuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Forventet YYYY-MM-DD"),
  partySize: z.coerce.number().int().min(1).max(20),
  locationId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = QuerySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { message: "Ugyldige query-params", issues: parsed.error.issues } },
      { status: 400 },
    );
  }
  const result = await fetchDineInAvailabilityServer(parsed.data);
  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}
