// Importing types for BoardView and User from the types module
import { BoardView, User } from "@/types/types";
// Importing the create function from zustand for state management
import { create } from "zustand";

// Defining the structure of the state
export type State = {
  boardView: BoardView;
  user: User | null;
};

// Defining the actions that can be performed on the state
export type Actions = {
  setBoardView: (boardView: BoardView) => void;
  setUser: (user: User | null) => void;
};
// Creating the dashboard store with initial state and actions
export const useDashboardStore = create<State & Actions>((set) => ({
  boardView: "list", // Initial board view set to "list"
  user: null, // Initial user set to null
  setUser: (user: User | null) => set({ user }), // Action to set the user
  setBoardView: (boardView: BoardView) => set({ boardView }), // Action to set the board view
}));
