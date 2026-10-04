import * as React from "react";
import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import { cn } from "@/shared/ui/utils/cn";

export const ScrollAreaRoot = BaseScrollArea.Root;
export const ScrollAreaViewport = BaseScrollArea.Viewport;
export const ScrollAreaContent = BaseScrollArea.Content;
export const ScrollAreaScrollbar = BaseScrollArea.Scrollbar;
export const ScrollAreaThumb = BaseScrollArea.Thumb;
export const ScrollAreaCorner = BaseScrollArea.Corner;

export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";
export type ScrollAreaVisibility = "hover" | "always";
export type ScrollAreaFade = boolean | ScrollAreaOrientation;

type BaseRootProps = React.ComponentPropsWithoutRef<typeof BaseScrollArea.Root>;

export interface ScrollAreaProps
  extends Omit<BaseRootProps, "className" | "children" | "style"> {
  orientation?: ScrollAreaOrientation;
  visibility?: ScrollAreaVisibility;
  fade?: ScrollAreaFade;
  fadeSize?: number;
  viewportClassName?: string;
  contentClassName?: string;
  scrollbarClassName?: string;
  thumbClassName?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function resolveFadeAxis(
  fade: ScrollAreaFade,
  orientation: ScrollAreaOrientation,
): ScrollAreaOrientation | null {
  if (fade === false) return null;
  if (fade === true) return orientation;
  return fade;
}

function fadeMask(axis: ScrollAreaOrientation, size: number): React.CSSProperties {
  const y = `linear-gradient(to bottom, transparent 0, #000 min(${size}px, var(--scroll-area-overflow-y-start, 0px)), #000 calc(100% - min(${size}px, var(--scroll-area-overflow-y-end, 0px))), transparent 100%)`;
  const x = `linear-gradient(to right, transparent 0, #000 min(${size}px, var(--scroll-area-overflow-x-start, 0px)), #000 calc(100% - min(${size}px, var(--scroll-area-overflow-x-end, 0px))), transparent 100%)`;
  const image = axis === "both" ? `${y}, ${x}` : axis === "vertical" ? y : x;
  return {
    maskImage: image,
    WebkitMaskImage: image,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    ...(axis === "both"
      ? { maskComposite: "intersect", WebkitMaskComposite: "source-in" }
      : null),
  };
}

const SCROLLBAR_CLASSES = cn(
  "flex touch-none select-none p-px",
  "transition-opacity duration-150 motion-reduce:transition-none",
  "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2.5 data-[orientation=vertical]:justify-center",
  "data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:w-full data-[orientation=horizontal]:items-center",
);

const THUMB_CLASSES = cn(
  "relative rounded-full bg-(--color-text-tertiary)",
  "transition-colors duration-150 motion-reduce:transition-none",
  "data-[orientation=vertical]:w-1.5 data-[orientation=horizontal]:h-1.5",
  "group-hover:bg-(--color-text-secondary) group-data-scrolling:bg-(--color-text-secondary)",
);

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  function ScrollArea(
    {
      orientation = "vertical",
      visibility = "hover",
      fade = false,
      fadeSize = 28,
      overflowEdgeThreshold = 1,
      viewportClassName,
      contentClassName,
      scrollbarClassName,
      thumbClassName,
      className,
      style,
      children,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) {
    const fadeAxis = resolveFadeAxis(fade, orientation);
    const showY = orientation === "vertical" || orientation === "both";
    const showX = orientation === "horizontal" || orientation === "both";
    return (
      <BaseScrollArea.Root
        overflowEdgeThreshold={overflowEdgeThreshold}
        data-orientation={orientation}
        data-visibility={visibility}
        className={cn("relative min-h-0 min-w-0", className)}
        style={style}
        {...rest}
      >
        <BaseScrollArea.Viewport
          ref={ref}
          aria-label={ariaLabel}
          className={cn(
            "size-full overscroll-contain rounded-[inherit] outline-none",
            "focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-inset",
            viewportClassName,
          )}
          style={fadeAxis ? fadeMask(fadeAxis, fadeSize) : undefined}
        >
          <BaseScrollArea.Content
            className={cn(
              orientation !== "vertical" && "w-max min-w-full",
              contentClassName,
            )}
          >
            {children}
          </BaseScrollArea.Content>
        </BaseScrollArea.Viewport>
        {showY ? (
          <Scrollbar
            orientation="vertical"
            visibility={visibility}
            className={scrollbarClassName}
            thumbClassName={thumbClassName}
          />
        ) : null}
        {showX ? (
          <Scrollbar
            orientation="horizontal"
            visibility={visibility}
            className={scrollbarClassName}
            thumbClassName={thumbClassName}
          />
        ) : null}
        {showX && showY ? (
          <BaseScrollArea.Corner className="bg-(--color-surface)" />
        ) : null}
      </BaseScrollArea.Root>
    );
  },
);

function Scrollbar({
  orientation,
  visibility,
  className,
  thumbClassName,
}: {
  orientation: "vertical" | "horizontal";
  visibility: ScrollAreaVisibility;
  className?: string;
  thumbClassName?: string;
}) {
  return (
    <BaseScrollArea.Scrollbar
      orientation={orientation}
      keepMounted={visibility === "always"}
      className={cn(
        "group",
        SCROLLBAR_CLASSES,
        visibility === "hover" &&
          "pointer-events-none opacity-0 data-hovering:pointer-events-auto data-hovering:opacity-100 data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-scrolling:transition-none",
        className,
      )}
    >
      <BaseScrollArea.Thumb className={cn(THUMB_CLASSES, thumbClassName)} />
    </BaseScrollArea.Scrollbar>
  );
}