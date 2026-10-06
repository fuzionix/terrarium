import * as React from "react";
import { cn } from "@/shared/ui/utils/cn";
import { nibbleForSlot, resolveDimension, FEATURE_SLOTS } from "./dimensions";
import { PALETTE_DIMENSION, paletteById, paletteByNibble, type MotePaletteId } from "./palette";
import { parseIdentitySeed } from "./seed";
import "./mote.css";

const CENTER = { x: 16, y: 16 } as const;
const SPHERE_RADIUS = 18.5;                   // Virtual Sphere Radius (Control the bulge)
const LOOK_TRAVEL = { x: 6, y: 6 } as const;  // Gaze movement range
const EYE_PROTRUSION = 1.2;
const MIN_FORESHORTEN = 0.2;

const EYE_SPEC = {
  strokeWidth: 4.6,
  halfHeight: 3.0,
  left: { x: 12, y: 15.5 },
  right: { x: 20, y: 15.5 },
} as const;

export interface MoteLook {
  x?: number;
  y?: number;
}

export interface MoteProps extends Omit<React.SVGProps<SVGSVGElement>, "seed"> {
  seed?: string;
  palette?: MotePaletteId;
  isLive?: boolean;
  look?: MoteLook;
}

interface ProjectedEye {
  x: number;
  y: number;
  wrapAngle: number;
  foreshorten: number;
}

function clampUnit(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(-1, value));
}

function fmt(n: number): number {
  return Math.round(n * 1000) / 1000;
}

function projectEye(restX: number, restY: number, lookX: number, lookY: number): ProjectedEye {
  // 1. Calculate the target unprojected coordinates
  const targetX = restX + lookX * LOOK_TRAVEL.x;
  const targetY = restY - lookY * LOOK_TRAVEL.y;

  // 2. Calculate the vector relative to the sphere center
  const dx = targetX - CENTER.x;
  const dy = targetY - CENTER.y;
  const dist = Math.hypot(dx, dy);

  if (dist < 1e-6) {
    return { x: targetX, y: targetY, wrapAngle: 0, foreshorten: 1 };
  }

  // 3. Calculate the spherical angle (Theta) and azimuthal angle (Wrap Angle)
  const normDist = Math.min(dist / SPHERE_RADIUS, 1);
  const theta = Math.asin(normDist); // Spherical latitude in radians
  const wrapAngle = Math.atan2(dy, dx) * (180 / Math.PI); // Rotation angle along the normal

  // 4. Calculate the foreshortening ratio along the line of sight
  const foreshorten = Math.max(MIN_FORESHORTEN, Math.cos(theta));

  // 5. Calculate the projected (x, y) coordinates (spherical projection arc length mapping + edge slight protrusion effect)
  const nx = dx / dist;
  const ny = dy / dist;
  
  // Map to the curved surface position through the sine arc length
  const effectiveRadius = SPHERE_RADIUS + EYE_PROTRUSION * (1 - Math.cos(theta));
  const projectedDist = effectiveRadius * Math.sin(theta);

  return {
    x: CENTER.x + projectedDist * nx,
    y: CENTER.y + projectedDist * ny,
    wrapAngle,
    foreshorten,
  };
}

function eyeTransform(projected: ProjectedEye): string {
  const x = fmt(projected.x);
  const y = fmt(projected.y);
  if (projected.foreshorten >= 0.999) {
    return `translate(${x} ${y})`;
  }
  const angle = fmt(projected.wrapAngle);
  const scale = fmt(projected.foreshorten);
  return `translate(${x} ${y}) rotate(${angle}) scale(${scale} 1) rotate(${-angle})`;
}

export const Mote = React.forwardRef<SVGSVGElement, MoteProps>(function Mote(
  { seed = "tera", palette, isLive = true, look, className, style, ...rest },
  ref,
) {
  const identity = parseIdentitySeed(seed);
  const paletteId = palette ?? resolveDimension(PALETTE_DIMENSION, identity);
  const colors = palette
    ? paletteById(palette)
    : paletteByNibble(nibbleForSlot(identity, FEATURE_SLOTS.palette));
  const animationDelay = `-${identity.phase}s`;
  const lookX = clampUnit(look?.x ?? 0);
  const lookY = clampUnit(look?.y ?? 0);
  const leftEye = projectEye(EYE_SPEC.left.x, EYE_SPEC.left.y, lookX, lookY);
  const rightEye = projectEye(EYE_SPEC.right.x, EYE_SPEC.right.y, lookX, lookY);

  return (
    <svg
      ref={ref}
      viewBox="0 0 32 32"
      data-slot="mote"
      data-seed-kind={identity.kind}
      data-palette={paletteId}
      data-live={isLive ? "true" : "false"}
      data-look-x={fmt(lookX)}
      data-look-y={fmt(lookY)}
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
        <EyeLine stroke={colors.eye} width={EYE_SPEC.strokeWidth} halfHeight={EYE_SPEC.halfHeight} projected={leftEye} />
        <EyeLine stroke={colors.eye} width={EYE_SPEC.strokeWidth} halfHeight={EYE_SPEC.halfHeight} projected={rightEye} />
      </g>
    </svg>
  );
});

function EyeLine({
  stroke,
  width,
  halfHeight,
  projected,
}: {
  stroke: string;
  width: number;
  halfHeight: number;
  projected: ProjectedEye;
}) {
  return (
    <g className="mote-eye" transform={eyeTransform(projected)}>
      <line
        x1={0}
        y1={-halfHeight}
        x2={0}
        y2={halfHeight}
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
      />
    </g>
  );
}