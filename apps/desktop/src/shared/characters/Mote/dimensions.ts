import { parseIdentitySeed, type IdentitySeed } from "./seed";

export const RANDOM_TAIL_NIBBLES = [31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20] as const;
export const FEATURE_SLOT_COUNT = RANDOM_TAIL_NIBBLES.length;
export const NEXT_FEATURE_SLOT = 2;
export const FEATURE_SLOTS = {
  palette: 0,
  eye: 1,
} as const;

export type FeatureSlotName = keyof typeof FEATURE_SLOTS;

type Sixteen<T> = readonly [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T];

export interface FeatureDimension<T extends string> {
  id: string;
  slot: number;
  variants: Sixteen<T>;
}

export function defineDimension<T extends string>(
  slot: number,
  id: string,
  variants: Sixteen<T>,
): FeatureDimension<T> {
  if (slot < 0 || slot >= FEATURE_SLOT_COUNT) {
    throw new Error(`Feature slot ${slot} is outside 0..${FEATURE_SLOT_COUNT - 1}`);
  }
  if (variants.length !== 16) {
    throw new Error(`Dimension "${id}" must have 16 variants`);
  }
  return { id, slot, variants };
}

export function nibbleForSlot(seed: IdentitySeed, slot: number): number {
  const hexIndex = RANDOM_TAIL_NIBBLES[slot];
  if (hexIndex === undefined) {
    throw new Error(`Feature slot ${slot} is outside 0..${FEATURE_SLOT_COUNT - 1}`);
  }
  return seed.nibbles[hexIndex] ?? 0;
}

export function randomTail(seed: IdentitySeed): readonly number[] {
  return RANDOM_TAIL_NIBBLES.map((hexIndex) => seed.nibbles[hexIndex] ?? 0);
}

export function resolveDimension<T extends string>(
  dimension: FeatureDimension<T>,
  seed: IdentitySeed,
): T {
  const nibble = nibbleForSlot(seed, dimension.slot);
  return dimension.variants[nibble] ?? dimension.variants[0];
}

export function readFeatureSlots(seedInput: string | undefined): {
  seed: IdentitySeed;
  slots: Record<FeatureSlotName, number>;
} {
  const seed = parseIdentitySeed(seedInput);
  return {
    seed,
    slots: {
      palette: nibbleForSlot(seed, FEATURE_SLOTS.palette),
      eye: nibbleForSlot(seed, FEATURE_SLOTS.eye),
    },
  };
}
