// Importing the create function from zustand for state management
import { create } from "zustand";

// Defining the structure of the state
export type State = {
  isDeleteModalOpen: boolean;
  isAddModalOpen: boolean;
};

// Defining the actions that can be performed on the state
export type Actions = {
  setIsDeleteModalOpen: (value: boolean) => void;
  setIsAddModalOpen: (value: boolean) => void;
};
// Creating the modal store with initial state and actions
export const useModalStore = create<State & Actions>((set) => ({
  // Initial state for isDeleteModalOpen set to false
  isDeleteModalOpen: false,
  // Initial state for isAddModalOpen set to false
  isAddModalOpen: false,

  // Action to set the state of isDeleteModalOpen
  setIsDeleteModalOpen: (value: boolean) => set({ isDeleteModalOpen: value }),
  // Action to set the state of isAddModalOpen
  setIsAddModalOpen: (value: boolean) => set({ isAddModalOpen: value }),
}));
