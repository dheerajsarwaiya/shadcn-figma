"use client";

import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { componentRegistry } from "@/lib/component-registry";
import { PanelLeft } from "lucide-react";
import { useId } from "react";

export function ComponentPalette() {
  return (
    <div className="w-64 border-r bg-muted/30">
      <div className="p-4 flex items-center gap-2">
        <PanelLeft className="h-5 w-5" />
        <h2 className="font-semibold">Components</h2>
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-65px)]">
        <div className="p-4 grid gap-4">
          {Object.entries(componentRegistry).map(([type, config]) => (
            <DraggableComponent key={type} type={type} label={config.label} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function DraggableComponent({ type, label }: { type: string; label: string }) {
  const id = useId();
  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
    id: `component-${id}-${type}`,
    data: {
      type,
      defaultProps: componentRegistry[type].defaultProps,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={cn(
        "cursor-grab border rounded-md p-2 bg-background hover:border-primary transition-colors touch-none",
        isDragging && "opacity-50"
      )}
    >
      {label}
    </div>
  );
}