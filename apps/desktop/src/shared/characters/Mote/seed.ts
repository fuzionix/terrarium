export type IdentitySeedKind = "uuid" | "alias";

export interface IdentitySeed {
  raw: string;
  normalized: string;
  kind: IdentitySeedKind;
  nibbles: readonly number[];
  phase: number;
}

const UUID_HEX = /^[0-9a-f]{32}$/;

// High-quality 32-bit FNV-1a + fmix32 finalizer
function hashString(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // Avalanching finalizer (fmix32)
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

// Fast high-quality PRNG (Mulberry32) for generating nibbles from a seed hash
function prngNibbles(seedHash: number): number[] {
  let state = seedHash;
  const nibbles: number[] = [];
  for (let i = 0; i < 32; i++) {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    const rand = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    nibbles.push(Math.floor(rand * 16));
  }
  return nibbles;
}

export function parseIdentitySeed(seedInput: string | undefined): IdentitySeed {
  const raw = (seedInput ?? "").trim() || "tera";
  const hex = raw
    .toLowerCase()
    .replace(/^urn:uuid:/, "")
    .replace(/[{}]/g, "")
    .replace(/-/g, "");

  if (UUID_HEX.test(hex)) {
    const nibbles = [...hex].map((c) => Number.parseInt(c, 16));
    const phase = ((nibbles[31] * 16 + nibbles[30]) % 40) / 10;
    return { raw, normalized: hex, kind: "uuid", nibbles, phase };
  }

  const seedHash = hashString(raw);
  const nibbles = prngNibbles(seedHash);
  const phase = ((seedHash % 400) / 100);

  return { raw, normalized: raw, kind: "alias", nibbles, phase };
}