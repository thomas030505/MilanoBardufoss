import { type NextRequest } from "next/server";
import { z } from "zod";

const BASE_URL = process.env.NEXT_PUBLIC_LETTBESTILT_URL ?? "https://lettbestilt.no";
const SLUG = process.env.NEXT_PUBLIC_SLUG!;
const API_KEY = process.env.LETTBESTILT_API_KEY;
const MAX_BODY_BYTES = 4 * 1024;

const CouponSchema = z
  .object({
    code: z.string().min(1).max(64),
    subtotal: z.number().finite().min(0).max(1_000_000),
    locationId: z.string().min(1).max(128).optional(),
  })
  .strict();

export async function POST(request: NextRequest) {
  if (!API_KEY) {
    return Response.json(
      { error: { code: "MISSING_API_KEY", message: "LETTBESTILT_API_KEY is not configured" } },
      { status: 500 }
    );
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return Response.json(
      { error: { code: "UNSUPPORTED_MEDIA_TYPE", message: "Content-Type must be application/json" } },
      { status: 415 }
    );
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_BODY_BYTES) {
    return Response.json(
      { error: { code: "PAYLOAD_TOO_LARGE", message: "Request body exceeds limit" } },
      { status: 413 }
    );
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return Response.json(
      { error: { code: "PAYLOAD_TOO_LARGE", message: "Request body exceeds limit" } },
      { status: 413 }
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return Response.json(
      { error: { code: "INVALID_JSON", message: "Request body is not valid JSON" } },
      { status: 400 }
    );
  }

  const result = CouponSchema.safeParse(parsed);
  if (!result.success) {
    return Response.json(
      { error: { code: "INVALID_INPUT", message: "Invalid coupon payload" } },
      { status: 400 }
    );
  }

  const upstream = await fetch(`${BASE_URL}/api/v1/coupons/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ slug: SLUG, ...result.data }),
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json" },
  });
}
