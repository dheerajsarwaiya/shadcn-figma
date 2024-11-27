"use client";

import { cn } from "@/lib/utils";
import { Component } from "@/lib/store";
import { componentRegistry } from "@/lib/component-registry";

interface AutoLayoutContainerProps {
  direction?: "horizontal" | "vertical";
  spacing?: string;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  padding?: string;
  width?: string;
  children?: React.ReactNode;
  className?: string;
}

const widthClasses = {
  'full': 'w-full block',
  '1/2': 'w-1/2 block',
  '1/3': 'w-1/3 block',
  '2/3': 'w-2/3 block',
  '1/4': 'w-1/4 block',
  '3/4': 'w-3/4 block',
  'auto': 'w-auto block'
} as const;

const paddingClasses = {
  '0': 'p-0',
  '2': 'p-2',
  '4': 'p-4',
  '6': 'p-6',
  '8': 'p-8',
  '12': 'p-12',
  '16': 'p-16'
} as const;

const gapClasses = {
  '0': 'gap-0',
  '1': 'gap-1',
  '2': 'gap-2',
  '4': 'gap-4',
  '6': 'gap-6',
  '8': 'gap-8',
  '12': 'gap-12',
  '16': 'gap-16'
} as const;

export function AutoLayoutContainer({
  direction = "vertical",
  spacing = "4",
  align = "start",
  justify = "start",
  padding = "4",
  width = "full",
  children,
  className,
}: AutoLayoutContainerProps) {
  console.log('AutoLayoutContainer props:', { direction, spacing, align, justify, padding, width }); // Debug log

  const widthClass = widthClasses[width as keyof typeof widthClasses] || widthClasses.full;
  const paddingClass = paddingClasses[padding as keyof typeof paddingClasses] || paddingClasses['4'];
  const gapClass = gapClasses[spacing as keyof typeof gapClasses] || gapClasses['4'];

  console.log('Applied classes:', { widthClass, paddingClass, gapClass }); // Debug log

  const containerClasses = cn(
    "border border-dashed border-border rounded-lg",
    widthClass,
    paddingClass,
    direction === "horizontal" ? "flex flex-row" : "flex flex-col",
    gapClass,
    {
      "items-start": align === "start",
      "items-center": align === "center",
      "items-end": align === "end",
      "items-stretch": align === "stretch",
      "justify-start": justify === "start",
      "justify-center": justify === "center",
      "justify-end": justify === "end",
      "justify-between": justify === "between",
      "justify-around": justify === "around",
    },
    className
  );

  console.log('Final container classes:', containerClasses); // Debug log

  return (
    <div
      className={containerClasses}
      style={{ 
        minWidth: 'min-content',
        display: 'block'
      }}
    >
      <div className={cn(
        "w-full",
        direction === "horizontal" ? "flex flex-row" : "flex flex-col",
        gapClass,
        {
          "items-start": align === "start",
          "items-center": align === "center",
          "items-end": align === "end",
          "items-stretch": align === "stretch",
          "justify-start": justify === "start",
          "justify-center": justify === "center",
          "justify-end": justify === "end",
          "justify-between": justify === "between",
          "justify-around": justify === "around",
        }
      )}>
        {children}
      </div>
    </div>
  );
}
