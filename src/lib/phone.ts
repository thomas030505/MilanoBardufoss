export function toE164Norwegian(raw: string): string | undefined {
  const digits = raw.replace(/\D/g, "").slice(-8);
  return digits.length === 8 ? `+47${digits}` : undefined;
}

export function formatNorwegianPhoneDisplay(phone: string | null): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "").slice(-8);
  if (digits.length !== 8) return phone;
  return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)}`;
}

export function telHref(phone: string | null): string {
  if (!phone) return "#";
  const digits = phone.replace(/\D/g, "").slice(-8);
  return `tel:+47${digits}`;
}
