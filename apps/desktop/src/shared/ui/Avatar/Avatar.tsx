import * as React from "react";
import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { Mote, type MotePaletteId, type EyeStyle } from "@/shared/characters";
import { cn } from "@/shared/ui/utils/cn";

export type AvatarSize = "sm" | "md" | "lg" | "xl";
export type AvatarStatus = "ready" | "running" | "paused" | "failed" | "remote" | "offline";

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: "size-6",
  md: "size-8",
  lg: "size-10",
  xl: "size-12",
};

const STATUS_SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: "size-1.5",
  md: "size-2",
  lg: "size-2.5",
  xl: "size-2.5",
};

const STATUS_CLASSES: Record<AvatarStatus, string> = {
  ready: "bg-success",
  running: "bg-brand motion-safe:animate-pulse",
  paused: "bg-warning",
  failed: "bg-danger",
  remote: "bg-remote",
  offline: "bg-observe",
};

const STATUS_LABEL: Record<AvatarStatus, string> = {
  ready: "Ready",
  running: "Running",
  paused: "Paused",
  failed: "Failed",
  remote: "Remote",
  offline: "Offline",
};

type BaseAvatarProps = React.ComponentPropsWithoutRef<typeof BaseAvatar.Root>;

export interface AvatarProps extends Omit<BaseAvatarProps, "className" | "children" | "style"> {
  size?: AvatarSize;
  status?: AvatarStatus;
  label?: string;
  seed?: string;
  palette?: MotePaletteId;
  eye?: EyeStyle;
  isLive?: boolean;
  character?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  {
    size = "md",
    status,
    label,
    seed = "tera",
    palette,
    eye,
    isLive = true,
    character,
    className,
    render,
    style,
    ...rest
  },
  ref,
) {
  const named = Boolean(label);
  const accessibleName = named
    ? status
      ? `${label}, ${STATUS_LABEL[status]}`
      : label
    : undefined;

  return (
    <BaseAvatar.Root
      ref={ref}
      render={render}
      role={named ? "img" : undefined}
      aria-label={accessibleName}
      aria-hidden={named ? undefined : true}
      data-slot="avatar"
      data-size={size}
      data-status={status}
      data-live={isLive ? "true" : "false"}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center align-middle",
        "outline-none focus-visible:ring-2 focus-visible:ring-brand-ring",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg)",
        SIZE_CLASSES[size],
        className,
      )}
      style={style}
      {...rest}
    >
      <BaseAvatar.Fallback className="flex size-full items-center justify-center overflow-hidden">
        {character ?? (
          <Mote seed={seed} palette={palette} eye={eye} isLive={isLive} />
        )}
      </BaseAvatar.Fallback>
      {status ? (
        <span
          data-slot="avatar-status"
          data-status={status}
          aria-hidden="true"
          className={cn(
            "absolute -right-0.5 -bottom-0.5 rounded-full",
            "ring-2 ring-(--color-bg)",
            STATUS_SIZE_CLASSES[size],
            STATUS_CLASSES[status],
          )}
        />
      ) : null}
    </BaseAvatar.Root>
  );
});
