import * as React from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { Field } from "@base-ui/react/field";
import { cn } from "@/shared/ui/utils/cn";

export type SwitchSize = "sm" | "md" | "lg" | "xl";

const TRACK_SIZE_CLASSES: Record<SwitchSize, string> = {
  sm: "h-4 w-7",
  md: "h-[18px] w-8",
  lg: "h-5 w-9",
  xl: "h-[22px] w-10",
};

const THUMB_SIZE_CLASSES: Record<SwitchSize, string> = {
  sm: "size-3 data-checked:translate-x-3",
  md: "size-3.5 data-checked:translate-x-3.5",
  lg: "size-4 data-checked:translate-x-4",
  xl: "size-[18px] data-checked:translate-x-[18px]",
};

type BaseSwitchRootProps = React.ComponentPropsWithoutRef<typeof BaseSwitch.Root>;

export interface SwitchProps extends Omit<BaseSwitchRootProps, "className"> {
  size?: SwitchSize;
  invalid?: boolean;
  className?: string;
  thumbClassName?: string;
}

export const Switch = React.forwardRef<HTMLElement, SwitchProps>(function Switch(
  {
    size = "md",
    invalid = false,
    disabled,
    readOnly,
    className,
    thumbClassName,
    ...rest
  },
  ref,
) {
  return (
    <BaseSwitch.Root
      ref={ref}
      disabled={disabled}
      readOnly={readOnly}
      aria-invalid={invalid || undefined}
      data-size={size}
      data-invalid={invalid || undefined}
      className={cn(
        "relative inline-flex shrink-0 items-center rounded-full p-0.5",
        "cursor-pointer select-none outline-none",
        "transition-colors duration-150 ease-out motion-reduce:transition-none",
        "bg-(--color-text-tertiary)/45",
        "data-checked:bg-brand",
        "focus-visible:ring-2 focus-visible:ring-brand-ring",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg)",
        "data-disabled:pointer-events-none data-disabled:opacity-40",
        "data-readonly:cursor-default",
        "data-invalid:ring-1 data-invalid:ring-inset data-invalid:ring-danger",
        "data-invalid:focus-visible:ring-danger/40",
        TRACK_SIZE_CLASSES[size],
        className,
      )}
      {...rest}
    >
      <BaseSwitch.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-white",
          "transition-transform duration-150 ease-out motion-reduce:transition-none",
          THUMB_SIZE_CLASSES[size],
          thumbClassName,
        )}
      />
    </BaseSwitch.Root>
  );
});

export interface SwitchFieldProps extends SwitchProps {
  label: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  name?: string;
  fieldClassName?: string;
}

export const SwitchField = React.forwardRef<HTMLElement, SwitchFieldProps>(function SwitchField(
  { label, description, error, name, invalid, disabled, fieldClassName, id, className, ...switchProps },
  ref,
) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;
  const isInvalid = Boolean(invalid || error);

  return (
    <Field.Root
      name={name}
      disabled={disabled}
      invalid={isInvalid || undefined}
      className={cn("flex w-full min-w-0 items-start justify-between gap-3", fieldClassName)}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <label
          htmlFor={inputId}
          className="min-w-0 truncate font-sans text-ui font-medium text-(--color-text-primary)"
        >
          {label}
        </label>
        {description ? (
          <p id={descriptionId} className="font-sans text-compact text-(--color-text-tertiary)">
            {description}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} role="alert" className="font-sans text-compact text-danger">
            {error}
          </p>
        ) : null}
      </div>
      <Switch
        ref={ref}
        id={inputId}
        name={name}
        disabled={disabled}
        invalid={isInvalid}
        aria-describedby={describedBy}
        className={cn("mt-0.5", className)}
        {...switchProps}
      />
    </Field.Root>
  );
});
