export type IdentitySeedKind = "uuid" | "alias";

export interface IdentitySeed {
  raw: string;
  kind: IdentitySeedKind;
  nibbles: readonly number[];
}

const UUID_HEX = /^[0-9a-f]{32}$/;

export function parseIdentitySeed(seed: string | undefined): IdentitySeed {
  const raw = (seed ?? "").trim();
  const hex = raw
    .toLowerCase()
    .replace(/^urn:uuid:/, "")
    .replace(/[{}]/g, "")
    .replace(/-/g, "");

  if (UUID_HEX.test(hex)) {
    return {
      raw,
      kind: "uuid",
      nibbles: hexToNibbles(hex),
    };
  }

  return {
    raw: raw || "tera",
    kind: "alias",
    nibbles: aliasNibbles(raw || "tera"),
  };
}

export function hexToNibbles(hex: string): number[] {
  return [...hex].map((character) => Number.parseInt(character, 16));
}

export function aliasNibbles(seed: string): number[] {
  let hash = 2166136261;
  const nibbles: number[] = [];
  for (let index = 0; index < 32; index += 1) {
    hash ^= seed.charCodeAt(index % seed.length);
    hash = Math.imul(hash, 16777619);
    hash ^= Math.imul(index + 1, 0x9e3779b9);
    nibbles.push((hash >>> 0) & 0xf);
  }
  return nibbles;
}

export function formatNibbles(nibbles: readonly number[]): string {
  return nibbles.map((nibble) => nibble.toString(16)).join("");
}
