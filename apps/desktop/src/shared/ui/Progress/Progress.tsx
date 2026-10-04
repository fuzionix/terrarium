import * as React from "react";
import { Progress as BaseProgress } from "@base-ui/react/progress";
import { cn } from "@/shared/ui/utils/cn";
import "./progress.css";

export const ProgressRoot = BaseProgress.Root;
export const ProgressLabel = BaseProgress.Label;
export const ProgressTrack = BaseProgress.Track;
export const ProgressIndicator = BaseProgress.Indicator;
export const ProgressValue = BaseProgress.Value;

export type ProgressSize = "sm" | "md" | "lg";

export type ProgressTone =
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "system"
  | "remote"
  | "observe";

export type ProgressStatus =
  | "creating"
  | "running"
  | "paused"
  | "snapshotting"
  | "restoring"
  | "publishing"
  | "failed"
  | "ready"
  | "destroyed";

const TRACK_SIZE_CLASSES: Record<ProgressSize, string> = {
  sm: "h-1",
  md: "h-1.5",
  lg: "h-2",
};

const INDICATOR_TONE_CLASSES: Record<ProgressTone, string> = {
  brand: "bg-brand",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  system: "bg-system",
  remote: "bg-remote",
  observe: "bg-observe",
};

const VALUE_TONE_CLASSES: Record<ProgressTone, string> = {
  brand: "text-(--color-text-primary)",
  success: "text-(--color-text-primary)",
  warning: "text-warning",
  danger: "text-danger",
  system: "text-(--color-text-primary)",
  remote: "text-(--color-text-primary)",
  observe: "text-(--color-text-secondary)",
};

const STATUS_TONE: Record<ProgressStatus, ProgressTone> = {
  creating: "observe",
  running: "brand",
  paused: "warning",
  snapshotting: "system",
  restoring: "system",
  publishing: "remote",
  failed: "danger",
  ready: "success",
  destroyed: "observe",
};

type BaseProgressRootProps = React.ComponentPropsWithoutRef<typeof BaseProgress.Root>;

export interface ProgressProps
  extends Omit<BaseProgressRootProps, "className" | "children" | "style" | "value"> {
  label: React.ReactNode;
  description?: React.ReactNode;
  value: number | null;
  valueLabel?:
    | React.ReactNode
    | ((formattedValue: string | null, value: number | null) => React.ReactNode);
  size?: ProgressSize;
  tone?: ProgressTone;
  status?: ProgressStatus;
  showValue?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function resolveProgressTone(
  tone: ProgressTone | undefined,
  status: ProgressStatus | undefined,
): ProgressTone {
  if (tone) return tone;
  if (status) return STATUS_TONE[status];
  return "brand";
}

function defaultValueLabel(
  formattedValue: string | null,
  value: number | null,
): React.ReactNode {
  if (value == null) return "—";
  return formattedValue;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  function Progress(
    {
      label,
      description,
      valueLabel,
      size = "md",
      tone,
      status,
      showValue = true,
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
    const resolvedTone = resolveProgressTone(tone, status);
    const isIndeterminate = value == null;
    const valueChildren =
      typeof valueLabel === "function"
        ? valueLabel
        : valueLabel != null
          ? () => valueLabel
          : defaultValueLabel;

    return (
      <BaseProgress.Root
        ref={ref}
        value={value}
        min={min}
        max={max}
        getAriaValueText={
          getAriaValueText ??
          (isIndeterminate
            ? () => "In progress, duration unknown"
            : undefined)
        }
        aria-describedby={description ? descriptionId : undefined}
        data-size={size}
        data-tone={resolvedTone}
        data-status={status}
        className={cn("flex w-full min-w-0 flex-col gap-1.5", className)}
        style={style}
        {...rest}
      >
        <span className="flex min-w-0 items-baseline justify-between gap-3">
          <BaseProgress.Label className="min-w-0 truncate font-sans text-ui font-medium text-(--color-text-primary)">
            {label}
          </BaseProgress.Label>
          {showValue ? (
            <BaseProgress.Value
              className={cn(
                "shrink-0 font-mono text-compact font-medium tabular-nums",
                VALUE_TONE_CLASSES[resolvedTone],
              )}
            >
              {valueChildren}
            </BaseProgress.Value>
          ) : null}
        </span>
        <BaseProgress.Track
          className={cn(
            "relative isolate w-full overflow-hidden rounded-full bg-(--color-surface-hover)",
            TRACK_SIZE_CLASSES[size],
          )}
        >
          <BaseProgress.Indicator
            className={cn(
              "terrarium-progress-indicator h-full rounded-full",
              "transition-[width] duration-200 ease-out motion-reduce:transition-none",
              INDICATOR_TONE_CLASSES[resolvedTone],
            )}
          />
        </BaseProgress.Track>
        {description ? (
          <span
            id={descriptionId}
            className="truncate font-sans text-compact text-(--color-text-tertiary)"
          >
            {description}
          </span>
        ) : null}
      </BaseProgress.Root>
    );
  },
);
