import * as React from "react";
import { Input as BaseInput } from "@base-ui/react/input";
import { Field } from "@base-ui/react/field";
import { Eye, EyeOff, X } from "lucide-react";
import { cn } from "@/shared/ui/utils/cn";

export type InputSize = "sm" | "md" | "lg" | "xl";
export type InputVariant = "outline" | "ghost";

const SHELL_SIZE_CLASSES: Record<InputSize, string> = {
  sm: "h-ctrl-sm gap-1.5 px-2 text-compact",
  md: "h-ctrl-md gap-1.5 px-2.5 text-ui",
  lg: "h-ctrl-lg gap-2 px-3 text-ui",
  xl: "h-ctrl-xl gap-2 px-3.5 text-ui",
};

const VARIANT_CLASSES: Record<InputVariant, string> = {
  outline: cn(
    "border border-(--color-border) bg-(--color-bg)",
    "hover:border-(--color-text-tertiary)/75",
  ),
  ghost: cn(
    "border border-transparent bg-transparent",
    "hover:bg-(--color-surface-hover)",
  ),
};

type BaseInputProps = React.ComponentPropsWithoutRef<typeof BaseInput>;
type InputChangeEventDetails = Parameters<NonNullable<BaseInputProps["onValueChange"]>>[1];

export interface InputProps extends Omit<BaseInputProps, "className" | "size" | "style" | "prefix"> {
  size?: InputSize;
  variant?: InputVariant;
  invalid?: boolean;
  mono?: boolean;
  fullWidth?: boolean;
  iconLeading?: React.ReactNode;
  iconTrailing?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  revealable?: boolean;
  className?: string;
  inputClassName?: string;
  style?: React.CSSProperties;
}

function toDisplayValue(value: BaseInputProps["value"] | BaseInputProps["defaultValue"]): string {
  if (value == null) return "";
  return Array.isArray(value) ? value.join(",") : String(value);
}

function createClearEventDetails(event: Event, trigger: Element): InputChangeEventDetails {
  let isCanceled = false;
  let isPropagationAllowed = false;

  return {
    reason: "none",
    event,
    cancel: () => {
      isCanceled = true;
    },
    allowPropagation: () => {
      isPropagationAllowed = true;
    },
    get isCanceled() {
      return isCanceled;
    },
    get isPropagationAllowed() {
      return isPropagationAllowed;
    },
    trigger,
  };
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = "md",
    variant = "outline",
    invalid = false,
    mono = false,
    fullWidth = true,
    iconLeading,
    iconTrailing,
    prefix,
    suffix,
    clearable = false,
    onClear,
    revealable,
    className,
    inputClassName,
    style,
    type = "text",
    disabled,
    readOnly,
    value,
    defaultValue,
    onValueChange,
    spellCheck,
    autoCapitalize,
    ...rest
  },
  ref,
) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState(() => toDisplayValue(defaultValue));
  const [revealed, setRevealed] = React.useState(false);
  const displayValue = isControlled ? toDisplayValue(value) : uncontrolledValue;
  const canReveal = (revealable ?? type === "password") && type === "password";
  const inputType = canReveal && revealed ? "text" : type;
  const showClear = clearable && displayValue.length > 0 && !disabled && !readOnly;

  const handleValueChange = React.useCallback(
    (next: string, eventDetails: Parameters<NonNullable<BaseInputProps["onValueChange"]>>[1]) => {
      if (!isControlled) setUncontrolledValue(next);
      onValueChange?.(next, eventDetails);
    },
    [isControlled, onValueChange],
  );

  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isControlled) setUncontrolledValue("");
    onClear?.();
    onValueChange?.("", createClearEventDetails(event.nativeEvent, event.currentTarget));
  };

  return (
    <div
      data-slot="input"
      data-size={size}
      data-variant={variant}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      style={style}
      className={cn(
        "relative inline-flex min-w-0 items-center",
        "rounded-control font-sans text-(--color-text-primary)",
        "transition-[border-color,background-color,box-shadow] duration-150",
        "focus-within:ring-2 focus-within:ring-brand-ring",
        "focus-within:ring-offset-2 focus-within:ring-offset-(--color-bg)",
        "has-disabled:pointer-events-none has-disabled:opacity-40",
        "has-data-invalid:border-danger has-data-invalid:focus-within:ring-danger/40",
        "data-invalid:border-danger data-invalid:focus-within:ring-danger/40",
        "data-readonly:bg-(--color-surface)",
        "[&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:stroke-2",
        SHELL_SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        fullWidth && "w-full",
        className,
      )}
    >
      {iconLeading ? (
        <span aria-hidden="true" className="inline-flex text-(--color-text-tertiary)">
          {iconLeading}
        </span>
      ) : null}
      {prefix ? (
        <span className="shrink-0 font-mono text-compact text-(--color-text-tertiary)">{prefix}</span>
      ) : null}
      <BaseInput
        ref={ref}
        type={inputType}
        disabled={disabled}
        readOnly={readOnly}
        value={isControlled ? value : uncontrolledValue}
        onValueChange={handleValueChange}
        aria-invalid={invalid || undefined}
        spellCheck={spellCheck ?? (mono ? false : undefined)}
        autoCapitalize={autoCapitalize ?? (mono ? "off" : undefined)}
        className={cn(
          "min-w-0 flex-1 bg-transparent font-normal outline-none",
          "placeholder:text-(--color-text-tertiary)",
          "disabled:cursor-not-allowed",
          mono && "font-mono tabular-nums",
          inputClassName,
        )}
        {...rest}
      />
      {showClear ? (
        <button
          type="button"
          aria-label="Clear"
          onClick={handleClear}
          className="inline-flex rounded-control text-(--color-text-tertiary) hover:text-(--color-text-primary) focus-visible:outline-none"
        >
          <X aria-hidden="true" />
        </button>
      ) : null}
      {canReveal ? (
        <button
          type="button"
          aria-label={revealed ? "Hide value" : "Show value"}
          aria-pressed={revealed}
          onClick={() => setRevealed((current) => !current)}
          className="inline-flex rounded-control text-(--color-text-tertiary) hover:text-(--color-text-primary) focus-visible:outline-none"
        >
          {revealed ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
        </button>
      ) : null}
      {suffix ? (
        <span className="shrink-0 font-mono text-compact text-(--color-text-tertiary)">{suffix}</span>
      ) : null}
      {iconTrailing ? (
        <span aria-hidden="true" className="inline-flex text-(--color-text-tertiary)">
          {iconTrailing}
        </span>
      ) : null}
    </div>
  );
});

export interface InputFieldProps extends InputProps {
  label: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  name?: string;
  fieldClassName?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
  { label, description, error, name, invalid, disabled, fieldClassName, id, ...inputProps },
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
      className={cn("flex w-full min-w-0 flex-col gap-1.5", fieldClassName)}
    >
      <label
        htmlFor={inputId}
        className="min-w-0 truncate font-sans text-ui font-medium text-(--color-text-primary)"
      >
        {label}
      </label>
      <Input
        ref={ref}
        id={inputId}
        name={name}
        disabled={disabled}
        invalid={isInvalid}
        aria-describedby={describedBy}
        {...inputProps}
      />
      {description ? (
        <p id={descriptionId} className="truncate font-sans text-compact text-(--color-text-tertiary)">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="font-sans text-compact text-danger">
          {error}
        </p>
      ) : null}
    </Field.Root>
  );
});
