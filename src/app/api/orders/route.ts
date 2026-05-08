import { type NextRequest } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_LETTBESTILT_URL ?? "https://lettbestilt.no";
const SLUG = process.env.NEXT_PUBLIC_SLUG!;
const API_KEY = process.env.LETTBESTILT_API_KEY;
const MAX_BODY_BYTES = 64 * 1024;

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

  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) {
    return Response.json(
      { error: { code: "PAYLOAD_TOO_LARGE", message: "Request body exceeds limit" } },
      { status: 413 }
    );
  }
  try {
    JSON.parse(body);
  } catch {
    return Response.json(
      { error: { code: "INVALID_JSON", message: "Request body is not valid JSON" } },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({
    slug: SLUG,
    successUrl: `${BASE_URL}/order/{TOKEN}?payment=success`,
    cancelUrl: `${BASE_URL}/order/canceled`,
  });

  const idempotencyKey =
    request.headers.get("Idempotency-Key") ?? crypto.randomUUID();

  const upstream = await fetch(`${BASE_URL}/api/v1/orders?${params}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
      Authorization: `Bearer ${API_KEY}`,
    },
    body,
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json" },
  });
}
