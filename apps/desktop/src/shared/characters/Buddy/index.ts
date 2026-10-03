export { Buddy } from "./Buddy";
export type { BuddyProps } from "./Buddy";
export { EYE_DIMENSION, EYE_SPECS, EYE_STYLES, eyeByNibble } from "./eyes";
export type { EyeSpec, EyeStroke, EyeStyle } from "./eyes";
export { BUDDY_PALETTES, PALETTE_DIMENSION, PALETTE_IDS, paletteById, paletteByNibble } from "./palette";
export type { BuddyPalette, BuddyPaletteId } from "./palette";
export {
  FEATURE_SLOT_COUNT,
  FEATURE_SLOTS,
  NEXT_FEATURE_SLOT,
  RANDOM_TAIL_NIBBLES,
  defineDimension,
  nibbleForSlot,
  randomTail,
  readFeatureSlots,
  resolveDimension,
} from "./dimensions";
export type { FeatureDimension, FeatureSlotName } from "./dimensions";
export { aliasNibbles, formatNibbles, parseIdentitySeed } from "./seed";
export type { IdentitySeed, IdentitySeedKind } from "./seed";
