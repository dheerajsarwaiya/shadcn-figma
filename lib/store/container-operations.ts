import { Component, DesignerStore } from './types';
import { componentRegistry } from '../component-registry';

export const containerOperations = (get: () => DesignerStore, set: (fn: (state: DesignerStore) => Partial<DesignerStore>) => void) => ({
  addComponentToContainer: (containerId: string, componentData: Omit<Component, "id">) =>
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

      const selectedComponents = allComponents.filter((c) =>
        state.selectedIds.includes(c.id)
      );

      const parentContainers = new Set(
        selectedComponents
          .map((c) => get().findComponentParent(c.id))
          .filter((p): p is Component => p !== undefined)
      );

      if (parentContainers.size > 1) return state;

      const parentContainer = Array.from(parentContainers)[0];

      const updateState = (components: Component[]): Component[] => {
        return components
          .map((c) => {
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
          })
          .filter((c) => !state.selectedIds.includes(c.id));
      };

      const containerId = crypto.randomUUID();
      const newContainer: Component = {
        id: containerId,
        type: "container",
        props: {
          ...componentRegistry.container.defaultProps,
          children: selectedComponents,
        },
        children: [],
        parentId: parentContainer?.id,
      };

      if (parentContainer) {
        return {
          components: updateState(state.components).map((c) => {
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
});
