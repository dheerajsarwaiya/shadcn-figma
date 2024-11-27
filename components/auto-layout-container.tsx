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
  children?: React.ReactNode;
  className?: string;
}

export function AutoLayoutContainer({
  direction = "vertical",
  spacing = "4",
  align = "start",
  justify = "start",
  padding = "4",
  children,
  className,
}: AutoLayoutContainerProps) {
  return (
    <div
      className={cn(
        "border border-dashed border-border rounded-lg",
        `p-${padding}`,
        direction === "horizontal" ? "flex flex-row" : "flex flex-col",
        `gap-${spacing}`,
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
      )}
    >
      {children}
    </div>
  );
}