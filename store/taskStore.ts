// Importing EmptyTask from constants for default task state
import { EmptyTask } from "@/lib/constants";
// Importing Task type from types
import { Task } from "@/types/types";
// Importing create function from zustand for state management
import { create } from "zustand";

// Defining the state structure
export type State = {
  tasks: Task[];
  newTask: Task;
  taskToDelete: string;
};

// Defining the actions available in the store
export type Actions = {
  setNewTask: (task: Task) => void;
  setTaskToDelete: (_id: string) => void;
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  updateTask: (task: Task) => void;
  setTasks: (tasks: Task[]) => void;
};
// Creating the task store with initial state and actions
export const useTaskStore = create<State & Actions>((set) => ({
  tasks: [], // Initial tasks array
  newTask: EmptyTask, // Initial new task state
  taskToDelete: "", // Initial task to delete state
  // Action to set tasks array
  setTasks: (tasks: Task[]) => set({ tasks }),
  // Action to set new task state
  setNewTask: (task: Task) => set({ newTask: task }),
  // Action to set task to delete state
  setTaskToDelete: (_id: string) => set({ taskToDelete: _id }),
  // Action to add a task to the tasks array
  addTask: (task: Task) => {
    set((state) => ({ tasks: [...state.tasks, { ...task }] }));
  },
  // Action to delete a task from the tasks array
  deleteTask: (_id: string) => 
    set((state) => ({ tasks: state.tasks.filter((task) => task._id !== _id) })),
  // Action to update a task in the tasks array
  updateTask: (task: Task) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === task._id ? task : t)),
    }));
  },
}));
