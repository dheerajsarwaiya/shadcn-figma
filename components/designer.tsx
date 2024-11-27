"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { ComponentPalette } from "./component-palette";
import { Canvas } from "./canvas";
import { PropertiesPanel } from "./properties-panel";
import { useDesignerStore } from "@/lib/store";
import { useId, useEffect, useCallback } from "react";

export function Designer() {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );
  
  const addComponent = useDesignerStore((state) => state.addComponent);
  const selectedIds = useDesignerStore((state) => state.selectedIds);
  const addComponentToContainer = useDesignerStore((state) => state.addComponentToContainer);
  const reorderComponents = useDesignerStore((state) => state.reorderComponents);
  const reorderChildrenInContainer = useDesignerStore((state) => state.reorderChildrenInContainer);
  const findComponentById = useDesignerStore((state) => state.findComponentById);
  const groupSelectedComponents = useDesignerStore((state) => state.groupSelectedComponents);
  const components = useDesignerStore((state) => state.components);
  
  const contextId = useId();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'g' && !e.repeat) {
      e.preventDefault();
      if (selectedIds.length >= 2) {
        groupSelectedComponents();
      }
    }
  }, [selectedIds.length, groupSelectedComponents]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    if (active.data.current?.type && over.id === "canvas") {
      // New component from palette
      addComponent({
        id: crypto.randomUUID(),
        type: active.data.current.type,
        props: active.data.current.defaultProps || {},
        children: [],
      });
    } else if (active.data.current?.type && selectedIds[0]) {
      // New component to container
      const container = findComponentById(selectedIds[0]);
      if (container?.type === "container") {
        addComponentToContainer(container.id, {
          type: active.data.current.type,
          props: active.data.current.defaultProps || {},
          children: [],
        });
      }
    } else if (active.data.current?.sortable) {
      // Reordering existing components
      const activeId = active.id as string;
      const overId = over.id as string;
      
      if (activeId === overId) return;

      const activeComponent = findComponentById(activeId);
      const overComponent = findComponentById(overId);

      if (!activeComponent || !overComponent) return;

      if (activeComponent.parentId === overComponent.parentId) {
        if (activeComponent.parentId) {
          // Reorder within container
          const container = findComponentById(activeComponent.parentId);
          if (!container) return;

          const oldIndex = container.props.children.findIndex((c) => c.id === activeId);
          const newIndex = container.props.children.findIndex((c) => c.id === overId);

          reorderChildrenInContainer(container.id, oldIndex, newIndex);
        } else {
          // Reorder at root level
          const oldIndex = components.findIndex((c) => c.id === activeId);
          const newIndex = components.findIndex((c) => c.id === overId);

          reorderComponents(oldIndex, newIndex);
        }
      }
    }
  };

  return (
    <DndContext
      id={contextId}
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen">
        <ComponentPalette />
        <Canvas />
        <PropertiesPanel />
      </div>
    </DndContext>
  );
}