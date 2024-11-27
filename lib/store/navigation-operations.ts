import { Component, DesignerStore } from './types';

export const navigationOperations = (get: () => DesignerStore, set: (fn: (state: DesignerStore) => Partial<DesignerStore>) => void) => ({
  getAllComponents: () => {
    const result: Component[] = [];
    const traverse = (components: Component[]) => {
      components.forEach((component) => {
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
          if (
            component.props.children.some((child: Component) => child.id === id)
          ) {
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
});
