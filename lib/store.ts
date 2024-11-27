import { create } from "zustand";

export interface Component {
  id: string;
  type: string;
  props: Record<string, any>;
  children: Component[];
  parentId?: string;
}

interface DesignerStore {
  components: Component[];
  selectedIds: string[];
  addComponent: (component: Component) => void;
  updateComponent: (id: string, props: Record<string, any>) => void;
  setSelectedIds: (ids: string[]) => void;
  groupSelectedComponents: () => void;
  updateChildren: (id: string, children: Component[]) => void;
  reorderComponents: (startIndex: number, endIndex: number) => void;
  reorderChildrenInContainer: (containerId: string, startIndex: number, endIndex: number) => void;
  addComponentToContainer: (containerId: string, component: Omit<Component, "id">) => void;
  findComponentById: (id: string) => Component | undefined;
  findComponentParent: (id: string) => Component | undefined;
  getAllComponents: () => Component[];
}

export const useDesignerStore = create<DesignerStore>((set, get) => ({
  components: [],
  selectedIds: [],

  getAllComponents: () => {
    const result: Component[] = [];
    const traverse = (components: Component[]) => {
      components.forEach(component => {
        result.push(component);
        if (component.type === "container") {
          traverse(component.props.children);
        }
      });
    };
    traverse(get().components);
    return result;
  },

  findComponentById: (id: string) => {
    const findInArray = (components: Component[]): Component | undefined => {
      for (const component of components) {
        if (component.id === id) return component;
        if (component.type === "container") {
          const found = findInArray(component.props.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return findInArray(get().components);
  },

  findComponentParent: (id: string) => {
    const findParent = (components: Component[]): Component | undefined => {
      for (const component of components) {
        if (component.type === "container") {
          if (component.props.children.some(child => child.id === id)) {
            return component;
          }
          const found = findParent(component.props.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return findParent(get().components);
  },

  addComponent: (component) =>
    set((state) => ({
      components: [...state.components, component],
    })),

  updateComponent: (id, props) =>
    set((state) => {
      const updateInArray = (components: Component[]): Component[] => {
        return components.map((c) => {
          if (c.id === id) return { ...c, props };
          if (c.type === "container") {
            return {
              ...c,
              props: {
                ...c.props,
                children: updateInArray(c.props.children),
              },
            };
          }
          return c;
        });
      };
      return { components: updateInArray(state.components) };
    }),

  setSelectedIds: (ids) => set({ selectedIds: ids }),

  updateChildren: (id, children) =>
    set((state) => {
      const updateInArray = (components: Component[]): Component[] => {
        return components.map((c) => {
          if (c.id === id) {
            return {
              ...c,
              props: { ...c.props, children },
            };
          }
          if (c.type === "container") {
            return {
              ...c,
              props: {
                ...c.props,
                children: updateInArray(c.props.children),
              },
            };
          }
          return c;
        });
      };
      return { components: updateInArray(state.components) };
    }),

  reorderComponents: (startIndex, endIndex) =>
    set((state) => {
      const newComponents = [...state.components];
      const [removed] = newComponents.splice(startIndex, 1);
      newComponents.splice(endIndex, 0, removed);
      return { components: newComponents };
    }),

  reorderChildrenInContainer: (containerId, startIndex, endIndex) =>
    set((state) => {
      const updateInArray = (components: Component[]): Component[] => {
        return components.map((c) => {
          if (c.id === containerId) {
            const newChildren = [...c.props.children];
            const [removed] = newChildren.splice(startIndex, 1);
            newChildren.splice(endIndex, 0, removed);
            return {
              ...c,
              props: { ...c.props, children: newChildren },
            };
          }
          if (c.type === "container") {
            return {
              ...c,
              props: {
                ...c.props,
                children: updateInArray(c.props.children),
              },
            };
          }
          return c;
        });
      };
      return { components: updateInArray(state.components) };
    }),

  addComponentToContainer: (containerId, componentData) =>
    set((state) => {
      const updateInArray = (components: Component[]): Component[] => {
        return components.map((c) => {
          if (c.id === containerId) {
            const newComponent = {
              ...componentData,
              id: crypto.randomUUID(),
              parentId: containerId,
            };
            return {
              ...c,
              props: {
                ...c.props,
                children: [...c.props.children, newComponent],
              },
            };
          }
          if (c.type === "container") {
            return {
              ...c,
              props: {
                ...c.props,
                children: updateInArray(c.props.children),
              },
            };
          }
          return c;
        });
      };
      return { components: updateInArray(state.components) };
    }),

  groupSelectedComponents: () =>
    set((state) => {
      if (state.selectedIds.length < 2) return state;

      // Get all components including nested ones
      const allComponents = get().getAllComponents();
      
      // Find selected components
      const selectedComponents = allComponents.filter(c => 
        state.selectedIds.includes(c.id)
      );

      // Find parent containers of selected components
      const parentContainers = new Set(
        selectedComponents
          .map(c => get().findComponentParent(c.id))
          .filter((p): p is Component => p !== undefined)
      );

      // If components are from different containers, we can't group them
      if (parentContainers.size > 1) return state;

      const parentContainer = Array.from(parentContainers)[0];

      // Remove selected components from their current location
      const updateState = (components: Component[]): Component[] => {
        return components.map(c => {
          if (c.type === "container") {
            return {
              ...c,
              props: {
                ...c.props,
                children: c.props.children.filter(
                  child => !state.selectedIds.includes(child.id)
                ),
              },
            };
          }
          return c;
        }).filter(c => !state.selectedIds.includes(c.id));
      };

      // Create new container with selected components
      const containerId = crypto.randomUUID();
      const newContainer: Component = {
        id: containerId,
        type: "container",
        props: {
          direction: "vertical",
          spacing: "4",
          align: "start",
          justify: "start",
          padding: "4",
          children: selectedComponents,
        },
        children: [],
        parentId: parentContainer?.id,
      };

      // Update the state
      if (parentContainer) {
        return {
          components: updateState(state.components).map(c => {
            if (c.id === parentContainer.id) {
              return {
                ...c,
                props: {
                  ...c.props,
                  children: [...c.props.children, newContainer],
                },
              };
            }
            return c;
          }),
          selectedIds: [containerId],
        };
      }

      return {
        components: [...updateState(state.components), newContainer],
        selectedIds: [containerId],
      };
    }),
}));