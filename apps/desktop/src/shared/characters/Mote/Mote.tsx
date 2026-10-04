import * as React from "react";
import { cn } from "@/shared/ui/utils/cn";
import { nibbleForSlot, resolveDimension, FEATURE_SLOTS } from "./dimensions";
import { EYE_SPECS, EYE_DIMENSION, type EyeStyle } from "./eyes";
import { PALETTE_DIMENSION, paletteById, paletteByNibble, type MotePaletteId } from "./palette";
import { parseIdentitySeed } from "./seed";
import "./mote.css";

export interface MoteProps extends Omit<React.SVGProps<SVGSVGElement>, "seed"> {
  seed?: string;
  palette?: MotePaletteId;
  eye?: EyeStyle;
  isLive?: boolean;
}

export const Mote = React.forwardRef<SVGSVGElement, MoteProps>(function Mote(
  { seed = "tera", palette, eye, isLive = true, className, style, ...rest },
  ref,
) {
  const identity = parseIdentitySeed(seed);
  const paletteId = palette ?? resolveDimension(PALETTE_DIMENSION, identity);
  const eyeStyle = eye ?? resolveDimension(EYE_DIMENSION, identity);
  const colors = palette 
    ? paletteById(palette) 
    : paletteByNibble(nibbleForSlot(identity, FEATURE_SLOTS.palette));
  const spec = EYE_SPECS[eyeStyle];
  const animationDelay = `-${identity.phase}s`;

  return (
    <svg
      ref={ref}
      viewBox="0 0 32 32"
      data-slot="mote"
      data-seed-kind={identity.kind}
      data-palette={paletteId}
      data-eye={eyeStyle}
      data-live={isLive ? "true" : "false"}
      aria-hidden="true"
      className={cn("mote block size-full", className)}
      style={style}
      {...rest}
    >
      <rect
        className="mote-body"
        x="1"
        y="1"
        width="30"
        height="30"
        rx="9.6"
        fill={colors.body}
      />
      <g className="mote-eyes" style={{ animationDelay }}>
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
