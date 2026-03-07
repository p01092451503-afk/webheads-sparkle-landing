import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Deduplicate location strings like "Seoul Seoul" → "Seoul" */
export function dedupeLocation(loc: string | null | undefined): string | null {
  if (!loc) return null;
  const parts = loc.split(" ");
  if (parts.length === 2 && parts[0] === parts[1]) return parts[0];
  return loc;
}
