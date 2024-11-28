"use client";

import React from "react";
import { cn } from "../lib/utils";
import { Component } from "../lib/store";

interface AutoLayoutContainerProps {
  direction?: "horizontal" | "vertical";
  spacing?: string;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  padding?: string;
  width?: string;
  fillChildren?: boolean;
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
  fillChildren = false,
  children,
  className,
}: AutoLayoutContainerProps) {
  const widthClass = widthClasses[width as keyof typeof widthClasses] || widthClasses.full;
  const paddingClass = paddingClasses[padding as keyof typeof paddingClasses] || paddingClasses['4'];
  const gapClass = gapClasses[spacing as keyof typeof gapClasses] || gapClasses['4'];

  // Wrap each child with appropriate width classes
  const wrappedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    // Get the component data from the child's props
    const componentData = child.props.component as Component | undefined;
    
    // Determine if this child should fill width
    const shouldFill = componentData?.props?.fillWidth ?? fillChildren;

    // Get the existing className from the child's root element
    const existingClassName = child.props.className || '';

    // Combine the classes
    const childClassName = cn(
      existingClassName,
      shouldFill && 'w-full flex-1'
    );

    return React.cloneElement(child, {
      ...child.props,
      className: childClassName,
    });
  });

  const containerClasses = cn(
    "border border-dashed border-border rounded-lg",
    "flex min-w-0",
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
    className
  );

  return (
    <div
      className={containerClasses}
      style={{ 
        minWidth: 'min-content',
      }}
    >
      {wrappedChildren}
    </div>
  );
}
