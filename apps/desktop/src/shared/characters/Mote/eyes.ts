import { defineDimension, FEATURE_SLOTS } from "./dimensions";

export const EYE_STYLES = [
  "neutral",
  "soft",
  "focus",
  "short",
  "tall",
  "hairline",
  "heavy",
  "close",
  "apart",
  "dot",
  "bead",
  "near",
  "far",
  "dash",
  "rule",
  "pill",
] as const;

export type EyeStyle = (typeof EYE_STYLES)[number];

export interface EyeStroke {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface EyeSpec {
  strokeWidth: number;
  left: EyeStroke;
  right: EyeStroke;
}

function bars(leftX: number, rightX: number, y1: number, y2: number): EyeSpec {
  return {
    strokeWidth: 4.6,
    left: { x1: leftX, y1, x2: leftX, y2 },
    right: { x1: rightX, y1, x2: rightX, y2 },
  };
}

export const EYE_SPECS: Record<EyeStyle, EyeSpec> = {
  neutral: bars(12, 20, 12.6, 18.4),
  soft: bars(12, 20, 14.6, 18.2),
  focus: bars(12, 20, 11.4, 19.2),
  short: bars(12, 20, 15.2, 17.6),
  tall: bars(12, 20, 11.6, 19.4),
  hairline: bars(12, 20, 12, 19),
  heavy: bars(12, 20, 13.2, 17.8),
  close: bars(12.6, 19.4, 12.6, 18.4),
  apart: bars(10.4, 21.6, 12.6, 18.4),
  dot: bars(12, 20, 14.2, 17.6),
  bead: bars(12, 20, 14.4, 17.2),
  near: bars(12.8, 19.2, 14.2, 17.6),
  far: bars(10.6, 21.4, 14.2, 17.6),
  dash: bars(12, 20, 14.4, 17.6),
  rule: bars(12, 20, 13.6, 18.4),
  pill: bars(12, 20, 14.2, 17.4),
};

export const EYE_DIMENSION = defineDimension(FEATURE_SLOTS.eye, "eye", EYE_STYLES);

export function eyeByNibble(nibble: number): EyeStyle {
  return EYE_STYLES[nibble & 0xf] ?? "neutral";
}
