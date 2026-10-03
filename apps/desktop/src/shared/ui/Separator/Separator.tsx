import * as React from "react";
import { Separator as BaseSeparator } from "@base-ui/react/separator";
import { cn } from "@/shared/ui/utils/cn";

export type SeparatorOrientation = "horizontal" | "vertical";

type BaseSeparatorProps = React.ComponentPropsWithoutRef<typeof BaseSeparator>;

export interface SeparatorProps
  extends Omit<BaseSeparatorProps, "className" | "orientation"> {
  orientation?: SeparatorOrientation;
  decorative?: boolean;
  className?: string;
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  function Separator(
    {
      orientation = "horizontal",
      decorative = false,
      className,
      role,
      "aria-hidden": ariaHidden,
      ...rest
    },
    ref,
  ) {
    return (
      <BaseSeparator
        ref={ref}
        orientation={orientation}
        role={decorative ? "none" : role}
        aria-hidden={decorative ? true : ariaHidden}
        data-slot="separator"
        className={cn(
          "shrink-0 border-0 bg-(--color-border) forced-colors:bg-[CanvasText]",
          "data-[orientation=horizontal]:h-(--border-width) data-[orientation=horizontal]:w-full",
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-(--border-width) data-[orientation=vertical]:self-stretch",
          className,
        )}
        {...rest}
      />
    )
  },
);
