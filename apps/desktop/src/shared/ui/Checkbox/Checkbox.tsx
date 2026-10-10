import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Field } from "@base-ui/react/field";
import { Check, Minus } from "lucide-react";
import { cn } from "@/shared/ui/utils/cn";

export type CheckboxSize = "sm" | "md" | "lg" | "xl";

const BOX_SIZE_CLASSES: Record<CheckboxSize, string> = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-[18px]",
  xl: "size-5",
};

const ICON_SIZE_CLASSES: Record<CheckboxSize, string> = {
  sm: "[&_svg]:size-2.5",
  md: "[&_svg]:size-3",
  lg: "[&_svg]:size-3.5",
  xl: "[&_svg]:size-3.5",
};

const ROW_SIZE_CLASSES: Record<CheckboxSize, string> = {
  sm: "min-h-ctrl-sm gap-2 text-compact",
  md: "min-h-ctrl-md gap-2 text-ui",
  lg: "min-h-ctrl-lg gap-2.5 text-ui",
  xl: "min-h-ctrl-xl gap-2.5 text-ui",
};

const COPY_OFFSET_CLASSES: Record<CheckboxSize, string> = {
  sm: "ps-5.5",
  md: "ps-6",
  lg: "ps-7",
  xl: "ps-7.5",
};

type BaseCheckboxProps = React.ComponentPropsWithoutRef<typeof BaseCheckbox.Root>;

export interface CheckboxProps extends Omit<BaseCheckboxProps, "className"> {
  size?: CheckboxSize;
  invalid?: boolean;
  className?: string;
}

export const Checkbox = React.forwardRef<HTMLElement, CheckboxProps>(function Checkbox(
  {
    size = "md",
    invalid = false,
    indeterminate = false,
    disabled,
    readOnly,
    required,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <BaseCheckbox.Root
      ref={ref}
      indeterminate={indeterminate}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      aria-invalid={invalid || undefined}
      data-slot="checkbox"
      data-size={size}
      data-invalid={invalid || undefined}
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        "rounded-sm border border-(--color-border) bg-(--color-bg)",
        "text-white",
        "transition-[background-color,border-color,box-shadow] duration-150",
        "outline-none focus-visible:ring-2 focus-visible:ring-brand-ring",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg)",
        "hover:border-(--color-text-tertiary)/75",
        "data-checked:border-brand data-checked:bg-brand data-checked:hover:border-brand",
        "data-indeterminate:border-brand data-indeterminate:bg-brand data-indeterminate:hover:border-brand",
        "data-invalid:border-danger",
        "data-invalid:data-checked:border-danger data-invalid:data-checked:bg-danger",
        "data-invalid:data-indeterminate:border-danger data-invalid:data-indeterminate:bg-danger",
        "data-invalid:focus-visible:ring-danger/40",
        "data-readonly:bg-(--color-surface) data-readonly:data-checked:bg-brand",
        "data-disabled:pointer-events-none data-disabled:opacity-40",
        "[&_svg]:shrink-0 [&_svg]:stroke-[2.5]",
        BOX_SIZE_CLASSES[size],
        ICON_SIZE_CLASSES[size],
        className,
      )}
      {...rest}
    >
      <BaseCheckbox.Indicator className="flex items-center justify-center data-unchecked:hidden">
        {indeterminate ? <Minus aria-hidden="true" /> : <Check aria-hidden="true" />}
      </BaseCheckbox.Indicator>
      {children}
    </BaseCheckbox.Root>
  );
});

export interface CheckboxFieldProps extends CheckboxProps {
  label: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  fieldClassName?: string;
}

export const CheckboxField = React.forwardRef<HTMLElement, CheckboxFieldProps>(function CheckboxField(
  { label, description, error, name, invalid, disabled, required, size = "md", fieldClassName, ...checkboxProps },
  ref,
) {
  const isInvalid = Boolean(invalid || error);
  return (
    <Field.Root
      name={name}
      disabled={disabled}
      invalid={isInvalid || undefined}
      className={cn("flex w-full min-w-0 flex-col", fieldClassName)}
    >
      <Field.Label
        className={cn(
          "flex w-full min-w-0 cursor-pointer items-center",
          "font-sans font-medium text-(--color-text-primary)",
          "data-disabled:cursor-not-allowed",
          ROW_SIZE_CLASSES[size],
        )}
      >
        <Checkbox
          ref={ref}
          name={name}
          size={size}
          disabled={disabled}
          required={required}
          invalid={isInvalid}
          {...checkboxProps}
        />
        <span className="min-w-0 translate-y-px truncate">
          {label}
          {required ? (
            <span aria-hidden="true" className="ps-0.5 text-danger">
              *
            </span>
          ) : null}
        </span>
      </Field.Label>
      {description ? (
        <Field.Description
          className={cn(
            "truncate font-sans text-(length:--text-compact) font-normal text-(--color-text-tertiary)",
            COPY_OFFSET_CLASSES[size],
          )}
        >
          {description}
        </Field.Description>
      ) : null}
      {error ? (
        <Field.Error
          match
          className={cn("font-sans text-(length:--text-compact) font-normal text-danger", COPY_OFFSET_CLASSES[size])}
        >
          {error}
        </Field.Error>
      ) : null}
    </Field.Root>
  );
});
