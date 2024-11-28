"use client";

import { useDesignerStore } from "../lib/store";
import { componentRegistry } from "../lib/component-registry";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Settings2 } from "lucide-react";
import { Switch } from "./ui/switch";
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
  type: "string" | "select" | "boolean";
  options?: string[];
  description?: string;
}

interface ContainerProps {
  direction: "horizontal" | "vertical";
  spacing: string;
  align: string;
  justify: string;
  padding: string;
  width: string;
  fillChildren: boolean;
  children: any[];
}

type ComponentProps = ContainerProps | Record<string, any>;

export function PropertiesPanel() {
  const selectedIds = useDesignerStore((state) => state.selectedIds);
  const components = useDesignerStore((state) => state.components);
  const findComponentById = useDesignerStore((state) => state.findComponentById);
  const updateComponent = useDesignerStore((state) => state.updateComponent);

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

  const handlePropertyChange = (key: string, value: string | boolean) => {
    console.log('Updating property:', { key, value, componentId: selectedIds[0] });
    
    // Preserve all existing props and only update the changed property
    const updatedProps = {
      ...selectedComponent.props,
      [key]: value,
    };

    // For container type, ensure children are properly handled
    if (selectedComponent.type === 'container') {
      updatedProps.children = (selectedComponent.props as ContainerProps).children;
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
            const currentValue = selectedComponent.props[key];
            const prop = property as PropertyConfig;
            
            return (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{prop.label}</Label>
                {prop.description && (
                  <p className="text-xs text-muted-foreground">{prop.description}</p>
                )}
                {prop.type === "select" ? (
                  <Select
                    value={String(currentValue)}
                    onValueChange={(value) => handlePropertyChange(key, value)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {prop.options?.map((option: string) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : prop.type === "boolean" ? (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={key}
                      checked={Boolean(currentValue)}
                      onCheckedChange={(checked) => handlePropertyChange(key, checked)}
                    />
                  </div>
                ) : (
                  <Input
                    id={key}
                    value={String(currentValue)}
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
