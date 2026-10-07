import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/ui/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-ctrl-sm px-3 text-compact",
  md: "h-ctrl-md px-4 text-ui",
  lg: "h-ctrl-lg px-5 text-ui",
  xl: "h-ctrl-xl px-6 text-ui",
};

const CONTENT_GAP_CLASSES: Record<ButtonSize, string> = {
  sm: "gap-1.5",
  md: "gap-1.5",
  lg: "gap-2",
  xl: "gap-2",
};

const ICON_ONLY_SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-ctrl-sm w-ctrl-sm p-0",
  md: "h-ctrl-md w-ctrl-md p-0",
  lg: "h-ctrl-lg w-ctrl-lg p-0",
  xl: "h-ctrl-xl w-ctrl-xl p-0",
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-brand text-white",
    "hover:bg-brand-hover active:bg-brand-hover",
  ),
  secondary: cn(
    "bg-(--color-surface) text-(--color-text-primary)",
    "border border-(--color-border)",
    "hover:bg-(--color-surface-hover)",
  ),
  ghost: cn(
    "bg-transparent text-(--color-text-secondary)",
    "hover:bg-(--color-surface-hover) hover:text-(--color-text-primary)",
  ),
  danger: cn(
    "bg-transparent text-danger",
    "border border-danger/30",
    "hover:bg-danger/10",
  ),
};

const PROGRESS_FILL_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-black/25",
  secondary: "bg-brand/15",
  ghost: "bg-brand/15",
  danger: "bg-danger/20",
};

function clampProgress(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

type BaseButtonProps = React.ComponentPropsWithoutRef<typeof BaseButton>;

export interface ButtonProps extends Omit<BaseButtonProps, "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  progress?: number;
  fullWidth?: boolean;
  iconLeading?: React.ReactNode;
  iconTrailing?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "secondary",
      size = "md",
      isLoading = false,
      progress,
      fullWidth = false,
      focusableWhenDisabled,
      iconLeading,
      iconTrailing,
      disabled,
      type = "button",
      className,
      children,
      render,
      ...rest
    },
    ref,
  ) {
    const isIconOnly = !children && !isLoading && Boolean(iconLeading || iconTrailing);
    const isDisabled = disabled || isLoading;
    const shouldBeFocusableWhenDisabled = focusableWhenDisabled ?? isLoading;
    const hasProgress = typeof progress === "number" && Number.isFinite(progress);
    const clampedProgress = hasProgress ? clampProgress(progress) : 0;
    const labelId = React.useId();

    return (
      <BaseButton
        ref={ref}
        type={type}
        render={render}
        disabled={isDisabled}
        focusableWhenDisabled={shouldBeFocusableWhenDisabled}
        aria-busy={isLoading || undefined}
        aria-labelledby={children && !rest["aria-label"] && !rest["aria-labelledby"] ? labelId : undefined}
        data-loading={isLoading || undefined}
        data-variant={variant}
        data-size={size}
        data-progress={hasProgress ? Math.round(clampedProgress) : undefined}
        className={cn(
          "relative isolate overflow-hidden",
          "inline-flex select-none items-center justify-center whitespace-nowrap cursor-pointer",
          "rounded-control font-sans font-medium",
          "transition-all duration-150",
          "enabled:active:translate-y-px",
          "outline-none focus-visible:ring-2 focus-visible:ring-brand-ring",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg)",
          "disabled:transform-none disabled:active:translate-y-0",
          "disabled:pointer-events-none",
          "disabled:not-data-loading:opacity-40 data-loading:pointer-events-none",
          "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:stroke-2",
          isIconOnly ? ICON_ONLY_SIZE_CLASSES[size] : SIZE_CLASSES[size],
          VARIANT_CLASSES[variant],
          fullWidth && "w-full",
          className,
        )}
        {...rest}
      >
        {hasProgress ? (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 z-0",
              "transition-[width] duration-200 ease-out motion-reduce:transition-none",
              PROGRESS_FILL_CLASSES[variant],
            )}
            style={{ width: `${clampedProgress}%` }}
          />
        ) : null}

        <span
          className={cn(
            "relative z-10 inline-flex min-w-0 items-center justify-center",
            !isIconOnly && CONTENT_GAP_CLASSES[size],
          )}
        >
          {isLoading ? (
            <Loader2 className="animate-[spin_0.5s_linear_infinite]" aria-hidden="true" />
          ) : (
            iconLeading
          )}
          {children ? <span id={labelId} className="truncate">{children}</span> : null}
          {!isLoading ? iconTrailing : null}
        </span>
      </BaseButton>
    );
  },
);