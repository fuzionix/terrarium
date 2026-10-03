import { defineDimension, FEATURE_SLOTS } from "./dimensions";

export interface BuddyPalette {
  id: string;
  body: string;
  eye: string;
}

export const BUDDY_PALETTES = [
  { id: "brand", body: "#2648f2", eye: "#f4f6ff" },
  { id: "iris", body: "#7c6cf0", eye: "#f5f3ff" },
  { id: "moss", body: "#3dbe7a", eye: "#052e16" },
  { id: "amber", body: "#f0b429", eye: "#422006" },
  { id: "coral", body: "#fb7185", eye: "#4c0519" },
  { id: "lagoon", body: "#22d3ee", eye: "#083344" },
  { id: "ink", body: "#334155", eye: "#f8fafc" },
  { id: "paper", body: "#e7ebf2", eye: "#0f172a" },
  { id: "violet", body: "#6d28d9", eye: "#f5f3ff" },
  { id: "tide", body: "#0f766e", eye: "#f0fdfa" },
  { id: "rose", body: "#e11d48", eye: "#fff1f2" },
  { id: "sand", body: "#d6b48a", eye: "#3f2a14" },
  { id: "lime", body: "#84cc16", eye: "#1a2e05" },
  { id: "dusk", body: "#1e293b", eye: "#e2e8f0" },
  { id: "peach", body: "#fdba74", eye: "#431407" },
  { id: "glacier", body: "#7dd3fc", eye: "#0c4a6e" },
] as const satisfies readonly BuddyPalette[];

export type BuddyPaletteId = (typeof BUDDY_PALETTES)[number]["id"];

export const PALETTE_IDS = [
  "brand",
  "iris",
  "moss",
  "amber",
  "coral",
  "lagoon",
  "ink",
  "paper",
  "violet",
  "tide",
  "rose",
  "sand",
  "lime",
  "dusk",
  "peach",
  "glacier",
] as const satisfies readonly BuddyPaletteId[];

export const PALETTE_DIMENSION = defineDimension(
  FEATURE_SLOTS.palette,
  "palette",
  PALETTE_IDS,
);

export function paletteById(id: BuddyPaletteId): BuddyPalette {
  return BUDDY_PALETTES.find((palette) => palette.id === id) ?? BUDDY_PALETTES[0];
}

export function paletteByNibble(nibble: number): BuddyPalette {
  return BUDDY_PALETTES[nibble & 0xf] ?? BUDDY_PALETTES[0];
}
