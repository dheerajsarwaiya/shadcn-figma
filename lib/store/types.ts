export interface Component {
  id: string;
  type: string;
  props: Record<string, any>;
  children: Component[];
  parentId?: string;
}

export interface DesignerStore {
  components: Component[];
  selectedIds: string[];
  copiedComponents: Component[];
  addComponent: (component: Component) => void;
  updateComponent: (id: string, props: Record<string, any>) => void;
  setSelectedIds: (ids: string[]) => void;
  groupSelectedComponents: () => void;
  updateChildren: (id: string, children: Component[]) => void;
  reorderComponents: (startIndex: number, endIndex: number) => void;
  reorderChildrenInContainer: (
    containerId: string,
    startIndex: number,
    endIndex: number
  ) => void;
  addComponentToContainer: (
    containerId: string,
    component: Omit<Component, "id">
  ) => void;
  findComponentById: (id: string) => Component | undefined;
  findComponentParent: (id: string) => Component | undefined;
  getAllComponents: () => Component[];
  moveComponentUp: (id: string) => void;
  moveComponentDown: (id: string) => void;
  removeComponent: (id: string) => void;
  copyComponent: (id: string) => void;
  addCopiedComponent: (containerId: string, copiedComponentId: string) => void;
  removeCopiedComponent: (id: string) => void;
}
