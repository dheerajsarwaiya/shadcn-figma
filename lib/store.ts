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
  moveComponentUp: (id: string) => void;
  moveComponentDown: (id: string) => void;
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
          if (component.props.children.some((child: Component) => child.id === id)) {
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

  moveComponentUp: (id: string) => {
    set((state) => {
      const parent = get().findComponentParent(id);
      if (!parent) {
        // Handle top-level components
        const index = state.components.findIndex(c => c.id === id);
        if (index <= 0) return state;
        const newComponents = [...state.components];
        [newComponents[index - 1], newComponents[index]] = [newComponents[index], newComponents[index - 1]];
        return { components: newComponents };
      }

      // Handle components inside containers
      const children = [...parent.props.children];
      const index = children.findIndex(c => c.id === id);
      if (index <= 0) return state;
      [children[index - 1], children[index]] = [children[index], children[index - 1]];
      
      return {
        components: state.components.map(c => {
          if (c.id === parent.id) {
            return {
              ...c,
              props: {
                ...c.props,
                children
              }
            };
          }
          return c;
        })
      };
    });
  },

  moveComponentDown: (id: string) => {
    set((state) => {
      const parent = get().findComponentParent(id);
      if (!parent) {
        // Handle top-level components
        const index = state.components.findIndex(c => c.id === id);
        if (index === -1 || index >= state.components.length - 1) return state;
        const newComponents = [...state.components];
        [newComponents[index], newComponents[index + 1]] = [newComponents[index + 1], newComponents[index]];
        return { components: newComponents };
      }

      // Handle components inside containers
      const children = [...parent.props.children];
      const index = children.findIndex(c => c.id === id);
      if (index === -1 || index >= children.length - 1) return state;
      [children[index], children[index + 1]] = [children[index + 1], children[index]];
      
      return {
        components: state.components.map(c => {
          if (c.id === parent.id) {
            return {
              ...c,
              props: {
                ...c.props,
                children
              }
            };
          }
          return c;
        })
      };
    });
  },

  addComponent: (component) => {
    console.log('Adding component:', component);
    if (component.type === 'container' && !component.props.width) {
      component.props.width = 'full';
    }
    set((state) => ({
      components: [...state.components, component],
    }));
  },

  updateComponent: (id, props) => {
    console.log('Updating component:', id, props);
    set((state) => {
      const updateInArray = (components: Component[]): Component[] => {
        return components.map((c) => {
          if (c.id === id) {
            console.log('Found component to update:', c);
            const updatedProps = { ...props };
            if (c.type === 'container') {
              updatedProps.children = c.props.children;
              if (!updatedProps.width) {
                updatedProps.width = c.props.width || 'full';
              }
            }
            console.log('Updated props:', updatedProps);
            return { ...c, props: updatedProps };
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
      const updatedComponents = updateInArray(state.components);
      console.log('Updated components:', updatedComponents);
      return { components: updatedComponents };
    });
  },

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

      const allComponents = get().getAllComponents();
      
      const selectedComponents = allComponents.filter(c => 
        state.selectedIds.includes(c.id)
      );

      const parentContainers = new Set(
        selectedComponents
          .map(c => get().findComponentParent(c.id))
          .filter((p): p is Component => p !== undefined)
      );

      if (parentContainers.size > 1) return state;

      const parentContainer = Array.from(parentContainers)[0];

      const updateState = (components: Component[]): Component[] => {
        return components.map(c => {
          if (c.type === "container") {
            return {
              ...c,
              props: {
                ...c.props,
                children: c.props.children.filter(
                  (child: Component) => !state.selectedIds.includes(child.id)
                ),
              },
            };
          }
          return c;
        }).filter(c => !state.selectedIds.includes(c.id));
      };

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
          width: "full",
          children: selectedComponents,
        },
        children: [],
        parentId: parentContainer?.id,
      };

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
