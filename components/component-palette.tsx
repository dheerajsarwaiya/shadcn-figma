"use client";

import { cn } from "../lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { componentRegistry } from "../lib/component-registry";
import { PanelLeft } from "lucide-react";
import { useDesignerStore } from "../lib/store";

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
            <ClickableComponent key={type} type={type as keyof typeof componentRegistry} label={config.label} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function ClickableComponent({ 
  type,
  label 
}: { 
  type: keyof typeof componentRegistry; 
  label: string;
}) {
  const addComponentToContainer = useDesignerStore((state) => state.addComponentToContainer);
  const addComponent = useDesignerStore((state) => state.addComponent);
  const selectedIds = useDesignerStore((state) => state.selectedIds);
  const findComponentById = useDesignerStore((state) => state.findComponentById);

  const handleClick = () => {
    // Get the currently selected container
    const selectedId = selectedIds[0];
    const selectedComponent = selectedId ? findComponentById(selectedId) : null;
    
    if (selectedComponent?.type === "container") {
      // Add to selected container
      addComponentToContainer(selectedComponent.id, {
        type,
        props: componentRegistry[type].defaultProps,
        children: [],
      });
    } else if (type === "container") {
      // Add new container to canvas
      addComponent({
        id: crypto.randomUUID(),
        type,
        props: componentRegistry[type].defaultProps,
        children: [],
      });
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "cursor-pointer border rounded-md p-2 bg-background hover:border-primary transition-colors",
        "hover:bg-muted/50"
      )}
    >
      {label}
    </div>
  );
}
