import { ChatSource } from '../models/chat-api.model';

export function formatSourceLocation(source: ChatSource): string {
  const parts = [source.locality, source.city].filter(Boolean);
  if (parts.length) return parts.join(', ');
  return source.address || 'Pune';
}

export function formatSourceBhk(source: ChatSource): string | null {
  if (!source.bhk?.length) return null;
  return source.bhk.map((v: string) => `${v} BHK`).join(' · ');
}

export function formatSourcePrice(source: ChatSource): string | null {
  if (source.display_price) return source.display_price;
  if (source.starting_price == null) return null;
  const lakhs = source.starting_price / 100_000;
  const formatted = lakhs >= 100
    ? `₹${(lakhs / 100).toFixed(1)} Cr`
    : `₹${lakhs.toFixed(0)} L`;
  if (source.max_price && source.max_price !== source.starting_price) {
    const maxLakhs = source.max_price / 100_000;
    const maxFormatted = maxLakhs >= 100
      ? `₹${(maxLakhs / 100).toFixed(1)} Cr`
      : `₹${maxLakhs.toFixed(0)} L`;
    return `${formatted} - ${maxFormatted}`;
  }
  return `${formatted} onwards`;
}

export function sourceThumbnail(source: ChatSource): string | null {
  return source.images?.[0] ?? null;
}
