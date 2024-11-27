import { useDesignerStore, Component } from "../lib/store";
import { componentRegistry } from "../lib/component-registry";
import { ArrowUp, ArrowDown, Trash2, Copy, Plus, X } from "lucide-react";
import { cn } from "../lib/utils";
import { MouseEvent, useState } from "react";

type ComponentType = keyof typeof componentRegistry;

interface ComponentProps {
  component: Component;
  isSelected: boolean;
  containerId?: string;
}

export function SortableComponent({
  component,
  isSelected,
  containerId,
}: ComponentProps) {
  const [showCopiedList, setShowCopiedList] = useState(false);
  const setSelectedIds = useDesignerStore((state) => state.setSelectedIds);
  const selectedIds = useDesignerStore((state) => state.selectedIds);
  const moveComponentUp = useDesignerStore((state) => state.moveComponentUp);
  const moveComponentDown = useDesignerStore((state) => state.moveComponentDown);
  const removeComponent = useDesignerStore((state) => state.removeComponent);
  const copyComponent = useDesignerStore((state) => state.copyComponent);
  const copiedComponents = useDesignerStore((state) => state.copiedComponents);
  const addCopiedComponent = useDesignerStore((state) => state.addCopiedComponent);
  const removeCopiedComponent = useDesignerStore((state) => state.removeCopiedComponent);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();

    if (e.shiftKey) {
      setSelectedIds([...selectedIds, component.id]);
    } else {
      setSelectedIds([component.id]);
    }
  };

  const ComponentToRender = componentRegistry[component.type as ComponentType].component;

  const Controls = () =>
    isSelected ? (
      <div className="absolute -left-12 top-0 flex flex-col gap-1 bg-background/80 p-1 rounded shadow-sm">
        <button
          onClick={(e) => {
            e.stopPropagation();
            moveComponentUp(component.id);
          }}
          className="p-1 hover:bg-muted rounded"
          title="Move Up"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            moveComponentDown(component.id);
          }}
          className="p-1 hover:bg-muted rounded"
          title="Move Down"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeComponent(component.id);
          }}
          className="p-1 hover:bg-red-100 text-red-600 rounded"
          title="Remove"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            copyComponent(component.id);
          }}
          className="p-1 hover:bg-blue-100 text-blue-600 rounded"
          title="Copy"
        >
          <Copy className="h-4 w-4" />
        </button>
        {component.type === "container" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowCopiedList(!showCopiedList);
            }}
            className="p-1 hover:bg-green-100 text-green-600 rounded"
            title="Add Copied Component"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
    ) : null;

  const CopiedComponentsList = () => {
    if (!showCopiedList || !isSelected || component.type !== "container") return null;

    return (
      <div className="absolute left-0 bottom-0 translate-y-full mt-2 w-full bg-white p-2 rounded-md shadow-lg border border-gray-200 z-50">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Copied Components</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowCopiedList(false);
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {copiedComponents.length === 0 ? (
          <p className="text-sm text-gray-500">No copied components</p>
        ) : (
          <ul className="space-y-1">
            {copiedComponents.map((copied) => (
              <li
                key={copied.id}
                className="flex items-center justify-between text-sm p-1 hover:bg-gray-100 rounded"
              >
                <span 
                  className="flex-grow cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    addCopiedComponent(component.id, copied.id);
                    setShowCopiedList(false);
                  }}
                >
                  {copied.type}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCopiedComponent(copied.id);
                  }}
                  className="p-1 hover:bg-red-100 text-red-600 rounded ml-2"
                  title="Remove from copied list"
                >
                  <X className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  if (component.type === "container") {
    return (
      <div
        className={cn(
          "relative cursor-pointer",
          isSelected && "ring-2 ring-primary ring-offset-2"
        )}
        onClick={handleClick}
      >
        <Controls />
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
        <CopiedComponentsList />
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative cursor-pointer",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <Controls />
      <ComponentToRender {...component.props} />
    </div>
  );
}
