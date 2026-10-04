import { defineDimension, FEATURE_SLOTS } from "./dimensions";

export interface MotePalette {
  id: string;
  body: string;
  eye: string;
}

export const MOTE_PALETTES = [
  { id: "brand", body: "#2648f2", eye: "#f4f6ff" },
  { id: "lemon", body: "#f2d026", eye: "#1a1a1a" },
  { id: "moss", body: "#3dbe7a", eye: "#052e16" },
  { id: "amber", body: "#f0b429", eye: "#422006" },
  { id: "coral", body: "#fb7185", eye: "#4c0519" },
  { id: "lagoon", body: "#22d3ee", eye: "#083344" },
  { id: "ink", body: "#334155", eye: "#f8fafc" },
  { id: "paper", body: "#e7ebf2", eye: "#0f172a" },
  { id: "violet", body: "#a78bfa", eye: "#2e1065" },
  { id: "berry", body: "#e879f9", eye: "#4a044e" },
  { id: "mint", body: "#5eead4", eye: "#042f2e" },
  { id: "sand", body: "#d6b48a", eye: "#3f2a14" },
  { id: "lime", body: "#84cc16", eye: "#1a2e05" },
  { id: "dusk", body: "#1e293b", eye: "#e2e8f0" },
  { id: "peach", body: "#fdba74", eye: "#431407" },
  { id: "glacier", body: "#7dd3fc", eye: "#0c4a6e" },
] as const satisfies readonly MotePalette[];

export type MotePaletteId = (typeof MOTE_PALETTES)[number]["id"];

export const PALETTE_IDS = [
  "brand",
  "lemon",
  "moss",
  "amber",
  "coral",
  "lagoon",
  "ink",
  "paper",
  "violet",
  "berry",
  "mint",
  "sand",
  "lime",
  "dusk",
  "peach",
  "glacier",
] as const satisfies readonly MotePaletteId[];

export const PALETTE_DIMENSION = defineDimension(
  FEATURE_SLOTS.palette,
  "palette",
  PALETTE_IDS,
);

export function paletteById(id: MotePaletteId): MotePalette {
  return MOTE_PALETTES.find((palette) => palette.id === id) ?? MOTE_PALETTES[0];
}

export function paletteByNibble(nibble: number): MotePalette {
  return MOTE_PALETTES[nibble & 0xf] ?? MOTE_PALETTES[0];
}
