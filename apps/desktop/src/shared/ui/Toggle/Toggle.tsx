import * as React from "react";
import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { cn } from "@/shared/ui/utils/cn";

export type ToggleVariant = "ghost" | "outline" | "danger";
export type ToggleSize = "sm" | "md" | "lg" | "xl";

const SIZE_CLASSES: Record<ToggleSize, string> = {
  sm: "h-ctrl-sm gap-1.5 px-3 text-compact",
  md: "h-ctrl-md gap-1.5 px-4 text-ui",
  lg: "h-ctrl-lg gap-2 px-5 text-ui",
  xl: "h-ctrl-xl gap-2 px-6 text-ui",
};

const ICON_ONLY_SIZE_CLASSES: Record<ToggleSize, string> = {
  sm: "h-ctrl-sm w-ctrl-sm p-0",
  md: "h-ctrl-md w-ctrl-md p-0",
  lg: "h-ctrl-lg w-ctrl-lg p-0",
  xl: "h-ctrl-xl w-ctrl-xl p-0",
};

const VARIANT_CLASSES: Record<ToggleVariant, string> = {
  ghost: cn(
    "bg-transparent text-(--color-text-secondary)",
    "hover:bg-(--color-surface-hover) hover:text-(--color-text-primary)",
    "data-pressed:bg-brand-muted data-pressed:text-brand",
  ),
  outline: cn(
    "border border-(--color-border) bg-(--color-surface) text-(--color-text-primary)",
    "hover:bg-(--color-surface-hover)",
    "data-pressed:border-brand/40 data-pressed:bg-brand-muted data-pressed:text-brand",
  ),
  danger: cn(
    "border border-danger/30 bg-transparent text-danger",
    "hover:bg-danger/10",
    "data-pressed:border-danger/50 data-pressed:bg-danger/15 data-pressed:text-danger",
  ),
};

type BaseToggleProps = React.ComponentPropsWithoutRef<typeof BaseToggle>;

export interface ToggleProps extends Omit<BaseToggleProps, "className"> {
  variant?: ToggleVariant;
  size?: ToggleSize;
  icon?: React.ReactNode;
  iconPressed?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  function Toggle(
    {
      variant = "ghost",
      size = "md",
      icon,
      iconPressed,
      fullWidth = false,
      disabled,
      className,
      children,
      value,
      ...rest
    },
    ref,
  ) {
    const isIconOnly = !children;
    return (
      <BaseToggle
        ref={ref}
        value={value}
        disabled={disabled}
        data-variant={variant}
        data-size={size}
        className={cn(
          "group",
          "inline-flex select-none items-center justify-center whitespace-nowrap",
          "cursor-pointer rounded-control font-sans font-medium",
          "transition-colors duration-75",
          "enabled:active:translate-y-px",
          "outline-none focus-visible:ring-2 focus-visible:ring-brand-ring",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg)",
          "disabled:pointer-events-none disabled:opacity-40",
          "data-disabled:pointer-events-none data-disabled:opacity-40",
          "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:stroke-2",
          isIconOnly ? ICON_ONLY_SIZE_CLASSES[size] : SIZE_CLASSES[size],
          VARIANT_CLASSES[variant],
          fullWidth && "w-full",
          className,
        )}
        {...rest}
      >
        <ToggleGlyph icon={icon} iconPressed={iconPressed} />
        {children ? <span className="truncate">{children}</span> : null}
      </BaseToggle>
    );
  },
);

function ToggleGlyph({
  icon,
  iconPressed,
}: {
  icon?: React.ReactNode;
  iconPressed?: React.ReactNode;
}) {
  if (!icon && !iconPressed) return null;
  if (!iconPressed) {
    return (
      <span aria-hidden="true" className="inline-flex">
        {icon}
      </span>
    );
  }
  return (
    <>
      <span aria-hidden="true" className="inline-flex group-data-pressed:hidden">
        {icon}
      </span>
      <span aria-hidden="true" className="hidden group-data-pressed:inline-flex">
        {iconPressed}
      </span>
    </>
  );
}
