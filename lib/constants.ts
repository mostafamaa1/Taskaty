import { Task } from "@/types/types";

export const EmptyTask: Task = {
    _id: "",
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    dueDate: undefined,
  };