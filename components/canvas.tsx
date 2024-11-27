"use client";

import { useDroppable } from "@dnd-kit/core";
import { useDesignerStore, Component } from "../lib/store";
import { componentRegistry } from "../lib/component-registry";
import { Layout, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "../lib/utils";
import { MouseEvent } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type ComponentType = keyof typeof componentRegistry;

export function Canvas() {
  const components = useDesignerStore((state) => state.components);
  const selectedIds = useDesignerStore((state) => state.selectedIds);
  const setSelectedIds = useDesignerStore((state) => state.setSelectedIds);

  const { setNodeRef, isOver } = useDroppable({
    id: "canvas",
  });

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
        ref={setNodeRef}
        onClick={handleCanvasClick}
        className={cn(
          "p-8 min-h-[calc(100vh-129px)]",
          isOver && "bg-muted/50 ring-2 ring-primary ring-inset"
        )}
      >
        {components.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Drag components here to start designing
          </div>
        ) : (
          <SortableContext
            items={components.map((c: Component) => c.id)}
            strategy={verticalListSortingStrategy}
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
          </SortableContext>
        )}
      </div>
    </div>
  );
}

interface SortableComponentProps {
  component: Component;
  isSelected: boolean;
  containerId?: string;
}

function SortableComponent({ component, isSelected }: SortableComponentProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: component.id,
    data: {
      type: component.type,
      sortable: true,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const setSelectedIds = useDesignerStore((state) => state.setSelectedIds);
  const selectedIds = useDesignerStore((state) => state.selectedIds);
  const moveComponentUp = useDesignerStore((state) => state.moveComponentUp);
  const moveComponentDown = useDesignerStore((state) => state.moveComponentDown);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    
    if (e.shiftKey) {
      setSelectedIds([...selectedIds, component.id]);
    } else {
      setSelectedIds([component.id]);
    }
  };

  const ComponentToRender = componentRegistry[component.type as ComponentType].component;

  const MoveControls = () => isSelected ? (
    <div className="absolute right-2 top-2 flex gap-1 bg-background/80 p-1 rounded shadow-sm">
      <button
        onClick={(e) => {
          e.stopPropagation();
          moveComponentUp(component.id);
        }}
        className="p-1 hover:bg-muted rounded"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          moveComponentDown(component.id);
        }}
        className="p-1 hover:bg-muted rounded"
      >
        <ArrowDown className="h-4 w-4" />
      </button>
    </div>
  ) : null;

  if (component.type === "container") {
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className={cn(
          "relative cursor-pointer",
          isSelected && "ring-2 ring-primary ring-offset-2",
          isDragging && "opacity-50"
        )}
        onClick={handleClick}
      >
        <MoveControls />
        <SortableContext
          items={component.props.children.map((c: Component) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <ComponentToRender {...component.props}>
            {component.props.children.map((child: Component) => (
              <SortableComponent
                key={child.id}
                component={child}
                isSelected={selectedIds.includes(child.id)}
                containerId={component.id}
              />
            ))}
          </ComponentToRender>
        </SortableContext>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      onClick={handleClick}
      className={cn(
        "relative cursor-pointer",
        isSelected && "ring-2 ring-primary ring-offset-2",
        isDragging && "opacity-50"
      )}
    >
      <MoveControls />
      <ComponentToRender {...component.props} />
    </div>
  );
}
