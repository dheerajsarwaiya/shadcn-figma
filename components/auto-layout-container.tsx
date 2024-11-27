"use client";

import React from "react";
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
  'full': 'w-full',
  '1/2': 'w-1/2',
  '1/3': 'w-1/3',
  '2/3': 'w-2/3',
  '1/4': 'w-1/4',
  '3/4': 'w-3/4',
  'auto': 'w-auto'
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
  const widthClass = widthClasses[width as keyof typeof widthClasses] || widthClasses.full;
  const paddingClass = paddingClasses[padding as keyof typeof paddingClasses] || paddingClasses['4'];
  const gapClass = gapClasses[spacing as keyof typeof gapClasses] || gapClasses['4'];

  const containerClasses = cn(
    "border border-dashed border-border rounded-lg",
    "flex min-w-0 flex-1", // Add flex-1 to make container grow
    widthClass,
    paddingClass,
    direction === "horizontal" ? "flex-row" : "flex-col",
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
    "[&>*]:flex-1 [&>*]:w-full", // Apply flex-1 and w-full to all direct children
    className
  );

  return (
    <div
      className={containerClasses}
      style={{ 
        minWidth: 'min-content',
      }}
    >
      {children}
    </div>
  );
}
