import * as React from "react";
import { Meter as BaseMeter } from "@base-ui/react/meter";

import { cn } from "@/shared/ui/utils/cn";

export const MeterRoot = BaseMeter.Root;
export const MeterLabel = BaseMeter.Label;
export const MeterTrack = BaseMeter.Track;
export const MeterIndicator = BaseMeter.Indicator;
export const MeterValue = BaseMeter.Value;

export type MeterSize = "sm" | "md" | "lg";

export type MeterTone =
  | "auto"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "system"
  | "remote"
  | "observe";

export type MeterResolvedTone = Exclude<MeterTone, "auto">;

export interface MeterMarker {
  value: number;
  label?: string;
}

const TRACK_SIZE_CLASSES: Record<MeterSize, string> = {
  sm: "h-1",
  md: "h-1.5",
  lg: "h-2",
};

const INDICATOR_TONE_CLASSES: Record<MeterResolvedTone, string> = {
  brand: "bg-brand",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  system: "bg-system",
  remote: "bg-remote",
  observe: "bg-observe",
};

const VALUE_TONE_CLASSES: Record<MeterResolvedTone, string> = {
  brand: "text-(--color-text-primary)",
  success: "text-(--color-text-primary)",
  warning: "text-warning",
  danger: "text-danger",
  system: "text-(--color-text-primary)",
  remote: "text-(--color-text-primary)",
  observe: "text-(--color-text-secondary)",
};

const MARKER_GUTTER_CLASSES: Record<MeterSize, string> = {
  sm: "py-1",
  md: "py-1.5",
  lg: "py-2",
};

const MARKER_STEM_CLASSES: Record<MeterSize, string> = {
  sm: "h-2 w-px",
  md: "h-3 w-0.5",
  lg: "h-4 w-0.5",
};

type BaseMeterRootProps = React.ComponentPropsWithoutRef<typeof BaseMeter.Root>;

export interface MeterProps
  extends Omit<BaseMeterRootProps, "className" | "children" | "style"> {
  label: React.ReactNode;
  description?: React.ReactNode;
  valueLabel?:
    | React.ReactNode
    | ((formattedValue: string, value: number) => React.ReactNode);
  size?: MeterSize;
  tone?: MeterTone;
  low?: number;
  high?: number;
  optimum?: number;
  showValue?: boolean;
  markers?: MeterMarker[];
  className?: string;
  style?: React.CSSProperties;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function resolveMeterTone(
  tone: MeterTone,
  value: number,
  min: number,
  max: number,
  low?: number,
  high?: number,
  optimum?: number,
): MeterResolvedTone {
  if (tone !== "auto") return tone;

  const span = max - min;
  const safeLow = low ?? (span === 0 ? min : min + span * 0.7);
  const safeHigh = high ?? (span === 0 ? max : min + span * 0.9);
  const preferHigh = optimum != null && optimum >= (min + max) / 2;

  if (preferHigh) {
    if (value < safeLow) return "danger";
    if (value < safeHigh) return "warning";
    return "success";
  }

  if (value >= safeHigh) return "danger";
  if (value >= safeLow) return "warning";
  return "success";
}

function markerOffset(value: number, min: number, max: number): string {
  const span = max - min;
  if (span === 0) return "0%";
  return `${clamp(((value - min) / span) * 100, 0, 100)}%`;
}

function MeterThresholdMark({
  marker,
  min,
  max,
  size,
}: {
  marker: MeterMarker;
  min: number;
  max: number;
  size: MeterSize;
}) {
  const offset = markerOffset(marker.value, min, max);
  const pct = Number.parseFloat(offset);
  const atStart = pct <= 2;
  const atEnd = pct >= 98;

  return (
    <span
      title={marker.label}
      aria-hidden="true"
      className={cn(
        "absolute top-1/2 z-10 flex -translate-y-1/2 flex-col items-center",
        atStart ? "translate-x-0" : atEnd ? "-translate-x-full" : "-translate-x-1/2",
      )}
      style={{ left: offset }}
    >
      <span
        className={cn(
          "-my-px rounded-full bg-(--color-text-secondary)",
          "shadow-[0_0_0_1px_var(--color-surface)]",
          MARKER_STEM_CLASSES[size],
        )}
      />
    </span>
  );
}

export const Meter = React.forwardRef<HTMLDivElement, MeterProps>(
  function Meter(
    {
      label,
      description,
      valueLabel,
      size = "md",
      tone = "auto",
      low,
      high,
      optimum,
      showValue = true,
      markers,
      className,
      style,
      value,
      min = 0,
      max = 100,
      getAriaValueText,
      ...rest
    },
    ref,
  ) {
    const descriptionId = React.useId();
    const resolvedTone = resolveMeterTone(tone, value, min, max, low, high, optimum);
    const valueChildren =
      typeof valueLabel === "function"
        ? valueLabel
        : valueLabel != null
          ? () => valueLabel
          : undefined;

    return (
      <BaseMeter.Root
        ref={ref}
        value={value}
        min={min}
        max={max}
        getAriaValueText={getAriaValueText}
        aria-describedby={description ? descriptionId : undefined}
        data-size={size}
        data-tone={resolvedTone}
        className={cn("flex w-full min-w-0 flex-col gap-1.5", className)}
        style={style}
        {...rest}
      >
        <span className="flex min-w-0 items-baseline justify-between gap-3">
          <BaseMeter.Label
            className={cn("min-w-0 truncate font-sans font-medium text-ui text-(--color-text-primary)")}
          >
            {label}
          </BaseMeter.Label>
          {showValue ? (
            <BaseMeter.Value
              className={cn(
                "shrink-0 font-mono font-medium tabular-nums",
                VALUE_TONE_CLASSES[resolvedTone],
              )}
            >
              {valueChildren}
            </BaseMeter.Value>
          ) : null}
        </span>
        <div
          className={cn(
            "relative w-full overflow-visible",
            markers?.length ? MARKER_GUTTER_CLASSES[size] : undefined,
          )}
        >
          <BaseMeter.Track
            className={cn(
              "relative isolate w-full overflow-hidden rounded-full bg-(--color-surface-hover)",
              TRACK_SIZE_CLASSES[size],
            )}
          >
            <BaseMeter.Indicator
              className={cn(
                "h-full rounded-full",
                "transition-[width] duration-200 ease-out motion-reduce:transition-none",
                INDICATOR_TONE_CLASSES[resolvedTone],
              )}
            />
          </BaseMeter.Track>
          {markers?.map((marker) => (
            <MeterThresholdMark
              key={`${marker.value}-${marker.label ?? ""}`}
              marker={marker}
              min={min}
              max={max}
              size={size}
            />
          ))}
        </div>
        {description ? (
          <span
            id={descriptionId}
            className="truncate font-sans text-compact text-(--color-text-tertiary)"
          >
            {description}
          </span>
        ) : null}
      </BaseMeter.Root>
    );
  },
);