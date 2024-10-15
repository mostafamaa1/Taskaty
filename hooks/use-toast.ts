"use client" // This line specifies that this file should be executed on the client-side

// Inspired by react-hot-toast library
import * as React from "react" // Importing React for use in the hook

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast" // Importing types for toast properties and action elements

const TOAST_LIMIT = 1 // Setting the maximum number of toasts that can be displayed at once
const TOAST_REMOVE_DELAY = 1000000 // Setting the delay in milliseconds before a toast is removed

type ToasterToast = ToastProps & {
  id: string // Adding an id property to the toast
  title?: React.ReactNode // Optional title property for the toast
  description?: React.ReactNode // Optional description property for the toast
  action?: ToastActionElement // Optional action property for the toast
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST", // Action type for adding a toast
  UPDATE_TOAST: "UPDATE_TOAST", // Action type for updating a toast
  DISMISS_TOAST: "DISMISS_TOAST", // Action type for dismissing a toast
  REMOVE_TOAST: "REMOVE_TOAST", // Action type for removing a toast
} as const // Defining action types as constants

let count = 0 // Initializing a counter for generating unique toast IDs

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER // Generating a unique ID for each toast
  return count.toString() // Returning the generated ID as a string
}

type ActionType = typeof actionTypes // Defining the type for action types

type Action =
  | {
      type: ActionType["ADD_TOAST"] // Action for adding a toast
      toast: ToasterToast // The toast to be added
    }
  | {
      type: ActionType["UPDATE_TOAST"] // Action for updating a toast
      toast: Partial<ToasterToast> // The partial toast to be updated
    }
  | {
      type: ActionType["DISMISS_TOAST"] // Action for dismissing a toast
      toastId?: ToasterToast["id"] // Optional ID of the toast to be dismissed
    }
  | {
      type: ActionType["REMOVE_TOAST"] // Action for removing a toast
      toastId?: ToasterToast["id"] // Optional ID of the toast to be removed
    }

interface State {
  toasts: ToasterToast[] // State interface for managing toasts
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>() // Map for managing toast timeouts

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return // Exiting if a timeout already exists for the toast
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId) // Removing the timeout from the map
    dispatch({
      type: "REMOVE_TOAST", // Dispatching action to remove the toast
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY) // Setting the timeout for toast removal

  toastTimeouts.set(toastId, timeout) // Adding the timeout to the map
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state, // Spreading the current state
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT), // Adding the new toast and limiting the total toasts
      }

    case "UPDATE_TOAST":
      return {
        ...state, // Spreading the current state
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t // Updating the toast if its ID matches
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action // Destructuring the toastId from the action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId) // Adding the toast to the remove queue if ID is provided
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id) // Adding all toasts to the remove queue if no ID is provided
        })
      }

      return {
        ...state, // Spreading the current state
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false, // Setting the toast as dismissed
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state, // Spreading the current state
          toasts: [], // Clearing all toasts if no ID is provided
        }
      }
      return {
        ...state, // Spreading the current state
        toasts: state.toasts.filter((t) => t.id !== action.toastId), // Removing the toast by its ID
      }
  }
}

const listeners: Array<(state: State) => void> = [] // Array for managing state change listeners

let memoryState: State = { toasts: [] } // Initializing the memory state with an empty toasts array

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action) // Updating the memory state with the reducer
  listeners.forEach((listener) => {
    listener(memoryState) // Notifying all listeners of the state change
  })
}

type Toast = Omit<ToasterToast, "id"> // Defining the type for a toast without an ID

function toast({ ...props }: Toast) {
  const id = genId() // Generating a unique ID for the toast

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST", // Dispatching action to update the toast
      toast: { ...props, id }, // Including the toast ID in the update
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id }) // Dispatching action to dismiss the toast

  dispatch({
    type: "ADD_TOAST", // Dispatching action to add the toast
    toast: {
      ...props,
      id,
      open: true, // Setting the toast as open
      onOpenChange: (open) => {
        if (!open) dismiss() // Dismissing the toast if it's closed
      },
    },
  })

  return {
    id: id, // Returning the toast ID
    dismiss, // Returning the dismiss function
    update, // Returning the update function
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState) // Initializing the state with the memory state

  React.useEffect(() => {
    listeners.push(setState) // Adding the state change listener
    return () => {
      const index = listeners.indexOf(setState) // Finding the index of the listener
      if (index > -1) {
        listeners.splice(index, 1) // Removing the listener
      }
    }
  }, [state]) // Dependency array for the effect

  return {
    ...state, // Spreading the state
    toast, // Returning the toast function
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }), // Returning the dismiss function
  }
}

export { useToast, toast } // Exporting the useToast hook and toast function
