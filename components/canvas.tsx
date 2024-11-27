"use client";

import { useDesignerStore, Component } from "../lib/store";
import { Layout } from "lucide-react";
import { MouseEvent, useEffect } from "react";
import { SortableComponent } from "./sortable-components";
import { componentRegistry } from "../lib/component-registry";

export function Canvas() {
  const components = useDesignerStore((state) => state.components);
  const selectedIds = useDesignerStore((state) => state.selectedIds);
  const setSelectedIds = useDesignerStore((state) => state.setSelectedIds);
  const addComponent = useDesignerStore((state) => state.addComponent);

  useEffect(() => {
    // Add initial container if canvas is empty
    if (components.length === 0) {
      const initialContainer: Component = {
        id: crypto.randomUUID(),
        type: "container",
        props: componentRegistry.container.defaultProps,
        children: []
      };
      addComponent(initialContainer);
    }
  }, [components.length, addComponent]);

  const handleCanvasClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedIds([]);
    }
  };

  return (
    <div className="flex-1 bg-background overflow-auto">
      <div className="p-4 flex items-center gap-2 border-b">
        <Layout className="h-5 w-5" />
        <h2 className="font-semibold">Canvas</h2>
        <div className="text-xs text-muted-foreground ml-auto">
          Shift + Click to select multiple • Ctrl/Cmd + G to group
        </div>
      </div>
      <div
        onClick={handleCanvasClick}
        className="p-8 min-h-[calc(100vh-129px)]"
      >
        <div className="space-y-4">
          {components.map((component: Component) => (
            <SortableComponent
              key={component.id}
              component={component}
              isSelected={selectedIds.includes(component.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
