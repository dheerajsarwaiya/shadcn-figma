"use client";

import { ComponentPalette } from "./component-palette";
import { Canvas } from "./canvas";
import { PropertiesPanel } from "./properties-panel";
import { useDesignerStore } from "../lib/store";
import { useCallback, useEffect } from "react";

export function Designer() {
  const selectedIds = useDesignerStore((state) => state.selectedIds);
  const groupSelectedComponents = useDesignerStore(
    (state) => state.groupSelectedComponents
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "g" && !e.repeat) {
        e.preventDefault();
        if (selectedIds.length >= 2) {
          groupSelectedComponents();
        }
      }
    },
    [selectedIds.length, groupSelectedComponents]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex h-screen">
      <ComponentPalette />
      <Canvas />
      <PropertiesPanel />
    </div>
  );
}
