import { create } from "zustand";
import { Component, DesignerStore } from "./types";
import { componentOperations } from "./component-operations";
import { selectionOperations } from "./selection-operations";
import { navigationOperations } from "./navigation-operations";
import { orderingOperations } from "./ordering-operations";
import { containerOperations } from "./container-operations";

const STORAGE_KEY = 'figma-bolt-components';

// Load components from localStorage
const loadComponents = (): Component[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading components from localStorage:', error);
    return [];
  }
};

// Save components to localStorage
const saveComponents = (components: Component[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(components));
  } catch (error) {
    console.error('Error saving components to localStorage:', error);
  }
};

// Create store with persistence
export const useDesignerStore = create<DesignerStore>((set, get) => ({
  components: loadComponents(),
  selectedIds: [],
  copiedComponents: [],

  ...componentOperations(
    get,
    (fn) => set((state) => {
      const newState = fn(state);
      // If components are updated, save to localStorage
      if ('components' in newState && Array.isArray(newState.components)) {
        saveComponents(newState.components);
      }
      return newState;
    })
  ),
  ...selectionOperations(get, set),
  ...navigationOperations(get, set),
  ...orderingOperations(
    get,
    (fn) => set((state) => {
      const newState = fn(state);
      // If components are updated, save to localStorage
      if ('components' in newState && Array.isArray(newState.components)) {
        saveComponents(newState.components);
      }
      return newState;
    })
  ),
  ...containerOperations(
    get,
    (fn) => set((state) => {
      const newState = fn(state);
      // If components are updated, save to localStorage
      if ('components' in newState && Array.isArray(newState.components)) {
        saveComponents(newState.components);
      }
      return newState;
    })
  ),
}));

export type { Component, DesignerStore } from "./types";
