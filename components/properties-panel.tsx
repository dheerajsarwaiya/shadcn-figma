"use client";

import { useDesignerStore } from "../lib/store";
import { componentRegistry } from "../lib/component-registry";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Settings2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type ComponentType = keyof typeof componentRegistry;

interface PropertyConfig {
  label: string;
  type: "string" | "select";
  options?: string[];
}

interface ContainerProps {
  direction: "horizontal" | "vertical";
  spacing: string;
  align: string;
  justify: string;
  padding: string;
  width: string;
  children: any[];
}

type ComponentProps = ContainerProps | Record<string, any>;

export function PropertiesPanel() {
  // Subscribe to both selectedIds and components to ensure re-render on changes
  const selectedIds = useDesignerStore((state) => state.selectedIds);
  const components = useDesignerStore((state) => state.components);
  const findComponentById = useDesignerStore((state) => state.findComponentById);
  const updateComponent = useDesignerStore((state) => state.updateComponent);

  // Get the selected component using both selectedIds and components
  // This ensures the component data is always fresh
  const selectedComponent = selectedIds[0]
    ? components.find(c => c.id === selectedIds[0]) || findComponentById(selectedIds[0])
    : undefined;

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

  const handlePropertyChange = (key: string, value: string) => {
    console.log('Updating property:', { key, value, componentId: selectedIds[0] });
    
    // Only update the specific property that changed
    const updatedProps: Partial<ComponentProps> = {
      [key]: value,
    };

    // If this is a container, ensure we preserve the children
    if (selectedComponent.type === 'container') {
      (updatedProps as Partial<ContainerProps>).children = (selectedComponent.props as ContainerProps).children;
    }

    console.log('Updated props:', updatedProps);
    updateComponent(selectedIds[0], updatedProps);
  };

  return (
    <div className="w-64 border-l bg-muted/30">
      <div className="p-4 flex items-center gap-2">
        <Settings2 className="h-5 w-5" />
        <h2 className="font-semibold">Properties</h2>
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-65px)]">
        <div className="p-4 space-y-4">
          {Object.entries(config.properties).map(([key, property]) => {
            const currentValue = selectedComponent.props[key] || "";
            console.log(`Property ${key} current value:`, currentValue);
            
            return (
              <div key={key}>
                <Label htmlFor={key}>{(property as PropertyConfig).label}</Label>
                {(property as PropertyConfig).type === "select" ? (
                  <Select
                    value={currentValue}
                    onValueChange={(value) => handlePropertyChange(key, value)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(property as PropertyConfig).options?.map(
                        (option: string) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={key}
                    value={currentValue}
                    onChange={(e) => handlePropertyChange(key, e.target.value)}
                    className="mt-1.5"
                  />
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
