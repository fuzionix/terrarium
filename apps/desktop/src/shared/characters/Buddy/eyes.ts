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

function bars(strokeWidth: number, leftX: number, rightX: number, y1: number, y2: number): EyeSpec {
  return {
    strokeWidth,
    left: { x1: leftX, y1, x2: leftX, y2 },
    right: { x1: rightX, y1, x2: rightX, y2 },
  };
}

export const EYE_SPECS: Record<EyeStyle, EyeSpec> = {
  neutral: bars(3.3, 12, 20, 12.6, 18.4),
  soft: bars(2.6, 12, 20, 14.6, 18.2),
  focus: bars(4, 12, 20, 11.4, 19.2),
  short: bars(3.3, 12, 20, 15.2, 17.6),
  tall: bars(3.3, 12, 20, 10.6, 20.4),
  hairline: bars(2.15, 12, 20, 11, 20),
  heavy: bars(4.6, 12, 20, 13.2, 17.8),
  close: bars(3.3, 13.6, 18.4, 12.6, 18.4),
  apart: bars(3.3, 10.4, 21.6, 12.6, 18.4),
  dot: bars(3.8, 12, 20, 15.2, 16.6),
  bead: bars(5.4, 12, 20, 14.4, 17.2),
  near: bars(4.8, 12.8, 19.2, 15.2, 16.6),
  far: bars(4.8, 10.6, 21.4, 15.2, 16.6),
  dash: bars(4.2, 12, 20, 14.4, 17.6),
  rule: bars(3.5, 12, 20, 13.6, 18.4),
  pill: bars(4.8, 12, 20, 14.2, 17.4),
};

export const EYE_DIMENSION = defineDimension(FEATURE_SLOTS.eye, "eye", EYE_STYLES);

export function eyeByNibble(nibble: number): EyeStyle {
  return EYE_STYLES[nibble & 0xf] ?? "neutral";
}
