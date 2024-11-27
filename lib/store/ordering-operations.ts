import { Component, DesignerStore } from './types';

export const orderingOperations = (get: () => DesignerStore, set: (fn: (state: DesignerStore) => Partial<DesignerStore>) => void) => ({
  reorderComponents: (startIndex: number, endIndex: number) =>
    set((state) => {
      const newComponents = [...state.components];
      const [removed] = newComponents.splice(startIndex, 1);
      newComponents.splice(endIndex, 0, removed);
      return { components: newComponents };
    }),

  reorderChildrenInContainer: (containerId: string, startIndex: number, endIndex: number) =>
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

  moveComponentUp: (id: string) => {
    set((state) => {
      const parent = get().findComponentParent(id);
      if (!parent) {
        const index = state.components.findIndex((c) => c.id === id);
        if (index <= 0) return state;
        const newComponents = [...state.components];
        [newComponents[index - 1], newComponents[index]] = [
          newComponents[index],
          newComponents[index - 1],
        ];
        return { components: newComponents };
      }

      const children = [...parent.props.children];
      const index = children.findIndex((c) => c.id === id);
      if (index <= 0) return state;
      [children[index - 1], children[index]] = [
        children[index],
        children[index - 1],
      ];

      return {
        components: state.components.map((c) => {
          if (c.id === parent.id) {
            return {
              ...c,
              props: {
                ...c.props,
                children,
              },
            };
          }
          if (c.type === "container") {
            return {
              ...c,
              props: {
                ...c.props,
                children: c.props.children.map((child: Component) => {
                  if (child.id === parent.id) {
                    return {
                      ...child,
                      props: {
                        ...child.props,
                        children,
                      },
                    };
                  }
                  return child;
                }),
              },
            };
          }
          return c;
        }),
      };
    });
  },

  moveComponentDown: (id: string) => {
    set((state) => {
      const parent = get().findComponentParent(id);
      if (!parent) {
        const index = state.components.findIndex((c) => c.id === id);
        if (index === -1 || index >= state.components.length - 1) return state;
        const newComponents = [...state.components];
        [newComponents[index], newComponents[index + 1]] = [
          newComponents[index + 1],
          newComponents[index],
        ];
        return { components: newComponents };
      }

      const children = [...parent.props.children];
      const index = children.findIndex((c) => c.id === id);
      if (index === -1 || index >= children.length - 1) return state;
      [children[index], children[index + 1]] = [
        children[index + 1],
        children[index],
      ];

      return {
        components: state.components.map((c) => {
          if (c.id === parent.id) {
            return {
              ...c,
              props: {
                ...c.props,
                children,
              },
            };
          }
          if (c.type === "container") {
            return {
              ...c,
              props: {
                ...c.props,
                children: c.props.children.map((child: Component) => {
                  if (child.id === parent.id) {
                    return {
                      ...child,
                      props: {
                        ...child.props,
                        children,
                      },
                    };
                  }
                  return child;
                }),
              },
            };
          }
          return c;
        }),
      };
    });
  },
});
