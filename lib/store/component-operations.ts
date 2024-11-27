import { Component } from './types';

export const componentOperations = (get: () => any, set: (fn: (state: any) => any) => void) => ({
  addComponent: (component: Component) => {
    console.log("Adding component:", component);
    if (component.type === "container" && !component.props.width) {
      component.props.width = "full";
    }
    set((state) => ({
      components: [...state.components, component],
    }));
  },

  updateComponent: (id: string, props: Record<string, any>) => {
    console.log("Updating component:", id, props);
    set((state) => {
      const updateInArray = (components: Component[]): Component[] => {
        return components.map((c) => {
          if (c.id === id) {
            console.log("Found component to update:", c);

            // Deep merge props to preserve nested properties
            const updatedProps = Object.entries(props).reduce((acc, [key, value]) => {
              // If the value is null or undefined, don't override existing value
              if (value === null || value === undefined) {
                return acc;
              }
              
              // If it's an object and not an array, merge deeply
              if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                return {
                  ...acc,
                  [key]: {
                    ...(acc[key] || {}),
                    ...value
                  }
                };
              }
              
              // For arrays and primitive values, replace directly
              return {
                ...acc,
                [key]: value
              };
            }, { ...c.props });

            // Ensure children are preserved for containers
            if (c.type === "container") {
              updatedProps.children = c.props.children;
            }

            console.log("Updated props:", updatedProps);
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
      console.log("Updated components:", updatedComponents);
      return { components: updatedComponents };
    });
  },

  removeComponent: (id: string) => {
    set((state) => {
      const parent = get().findComponentParent(id);
      if (!parent) {
        return {
          components: state.components.filter((c: Component) => c.id !== id),
        };
      }

      return {
        components: state.components.map((c: Component) => {
          if (c.id === parent.id) {
            return {
              ...c,
              props: {
                ...c.props,
                children: c.props.children.filter(
                  (child: Component) => child.id !== id
                ),
              },
            };
          }
          return c;
        }),
      };
    });
  },

  updateChildren: (id: string, children: Component[]) =>
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
});
