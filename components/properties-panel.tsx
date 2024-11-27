"use client";

import { useDesignerStore } from "@/lib/store";
import { componentRegistry } from "@/lib/component-registry";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Settings2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type ComponentType = keyof typeof componentRegistry;

interface PropertyConfig {
  label: string;
  type: "string" | "select";
  options?: string[];
}

export function PropertiesPanel() {
  const selectedIds = useDesignerStore((state) => state.selectedIds);
  const findComponentById = useDesignerStore((state) => state.findComponentById);
  const updateComponent = useDesignerStore((state) => state.updateComponent);

  const selectedComponent = selectedIds[0] ? findComponentById(selectedIds[0]) : undefined;

  if (!selectedComponent) {
    return (
      <div className="w-64 border-l bg-muted/30">
        <div className="p-4 flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          <h2 className="font-semibold">Properties</h2>
        </div>
        <Separator />
        <div className="p-4 text-sm text-muted-foreground">
          {selectedIds.length > 1 
            ? "Group components with Ctrl/Cmd + G"
            : "Select a component to edit its properties"}
        </div>
      </div>
    );
  }

  const config = componentRegistry[selectedComponent.type as ComponentType];

  return (
    <div className="w-64 border-l bg-muted/30">
      <div className="p-4 flex items-center gap-2">
        <Settings2 className="h-5 w-5" />
        <h2 className="font-semibold">Properties</h2>
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-65px)]">
        <div className="p-4 space-y-4">
          {Object.entries(config.properties).map(([key, property]) => (
            <div key={key}>
              <Label htmlFor={key}>{(property as PropertyConfig).label}</Label>
              {(property as PropertyConfig).type === "select" ? (
                <Select
                  value={selectedComponent.props[key] || ""}
                  onValueChange={(value) =>
                    updateComponent(selectedIds[0], {
                      ...selectedComponent.props,
                      [key]: value,
                    })
                  }
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(property as PropertyConfig).options?.map((option: string) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={key}
                  value={selectedComponent.props[key] || ""}
                  onChange={(e) =>
                    updateComponent(selectedIds[0], {
                      ...selectedComponent.props,
                      [key]: e.target.value,
                    })
                  }
                  className="mt-1.5"
                />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
