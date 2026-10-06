export { Mote } from "./Mote";
export type { MoteProps, MoteLook } from "./Mote";
export { MOTE_PALETTES, PALETTE_DIMENSION, PALETTE_IDS, paletteById, paletteByNibble } from "./palette";
export type { MotePalette, MotePaletteId } from "./palette";
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
export { parseIdentitySeed } from "./seed";
export type { IdentitySeed, IdentitySeedKind } from "./seed";