import { Component, DesignerStore } from './types';

export const selectionOperations = (get: () => DesignerStore, set: (fn: (state: DesignerStore) => Partial<DesignerStore>) => void) => ({
  setSelectedIds: (ids: string[]) => set((state) => ({ selectedIds: ids })),

  copyComponent: (id: string) => {
    set((state) => {
      const component = get().findComponentById(id);
      if (!component) return state;

      const cloneWithNewIds = (comp: Component): Component => {
        const newId = crypto.randomUUID();
        const clone = {
          ...comp,
          id: newId,
          children: [],
        };

        if (comp.type === "container") {
          clone.props = {
            ...comp.props,
            children: comp.props.children.map(cloneWithNewIds),
          };
        }

        return clone;
      };

      const clonedComponent = cloneWithNewIds(component);
      return {
        copiedComponents: [...state.copiedComponents, clonedComponent],
      };
    });
  },

  addCopiedComponent: (containerId: string, copiedComponentId: string) => {
    set((state) => {
      const copiedComponent = state.copiedComponents.find(
        (c: Component) => c.id === copiedComponentId
      );
      if (!copiedComponent) return state;

      const cloneWithNewIds = (comp: Component): Component => {
        const newId = crypto.randomUUID();
        const clone = {
          ...comp,
          id: newId,
          children: [],
        };

        if (comp.type === "container") {
          clone.props = {
            ...comp.props,
            children: comp.props.children.map(cloneWithNewIds),
          };
        }

        return clone;
      };

      const newComponent = cloneWithNewIds(copiedComponent);

      if (!containerId) {
        return {
          components: [...state.components, newComponent],
        };
      }

      return {
        components: state.components.map((c: Component) => {
          if (c.id === containerId) {
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
                children: c.props.children.map((child: Component) => {
                  if (child.id === containerId) {
                    return {
                      ...child,
                      props: {
                        ...child.props,
                        children: [...child.props.children, newComponent],
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

  removeCopiedComponent: (id: string) => {
    set((state) => ({
      copiedComponents: state.copiedComponents.filter((c: Component) => c.id !== id),
    }));
  },
});
