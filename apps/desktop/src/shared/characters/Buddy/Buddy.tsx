import * as React from "react";
import { cn } from "@/shared/ui/utils/cn";
import { nibbleForSlot, resolveDimension } from "./dimensions";
import { EYE_SPECS, EYE_DIMENSION, type EyeStyle } from "./eyes";
import { PALETTE_DIMENSION, paletteById, paletteByNibble, type BuddyPaletteId } from "./palette";
import { parseIdentitySeed } from "./seed";
import "./buddy.css";

function phaseFromSeed(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 40) / 10;
}

export interface BuddyProps extends Omit<React.SVGProps<SVGSVGElement>, "seed"> {
  seed?: string;
  palette?: BuddyPaletteId;
  eye?: EyeStyle;
  isLive?: boolean;
}

export const Buddy = React.forwardRef<SVGSVGElement, BuddyProps>(function Buddy(
  { seed = "tera", palette, eye, isLive = true, className, style, ...rest },
  ref,
) {
  const identity = parseIdentitySeed(seed);
  const paletteId = palette ?? resolveDimension(PALETTE_DIMENSION, identity);
  const eyeStyle = eye ?? resolveDimension(EYE_DIMENSION, identity);
  const colors = palette ? paletteById(palette) : paletteByNibble(nibbleForSlot(identity, 0));
  const spec = EYE_SPECS[eyeStyle];
  const phase = phaseFromSeed(identity.raw);

  return (
    <svg
      ref={ref}
      viewBox="0 0 32 32"
      data-slot="buddy"
      data-seed-kind={identity.kind}
      data-palette={paletteId}
      data-eye={eyeStyle}
      data-live={isLive ? "true" : "false"}
      aria-hidden="true"
      className={cn("buddy block size-full", className)}
      style={style}
      {...rest}
    >
      <rect
        className="buddy-body"
        x="1"
        y="1"
        width="30"
        height="30"
        rx="9.6"
        fill={colors.body}
        style={{ animationDelay: `${phase}s` }}
      />
      <g className="buddy-eyes" style={{ animationDelay: `${phase}s` }}>
        <EyeLine stroke={colors.eye} width={spec.strokeWidth} line={spec.left} />
        <EyeLine stroke={colors.eye} width={spec.strokeWidth} line={spec.right} />
      </g>
    </svg>
  );
});

function EyeLine({
  stroke,
  width,
  line,
}: {
  stroke: string;
  width: number;
  line: { x1: number; y1: number; x2: number; y2: number };
}) {
  return (
    <line
      x1={line.x1}
      y1={line.y1}
      x2={line.x2}
      y2={line.y2}
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
    />
  );
}
