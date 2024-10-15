// models/Task.ts
import mongoose, { Schema, Document, Model } from "mongoose"; // Importing mongoose and its types

export interface ITask extends Document {
  title: string; // Task title
  description?: string; // Task description (optional)
  status: "To Do" | "In Progress" | "Completed"; // Task status
  priority: "Low" | "Medium" | "High"; // Task priority
  dueDate?: Date; // Task due date (optional)
  user: string; // Assuming user is represented by an email or ID
}

const TaskSchema: Schema<ITask> = new Schema({
  title: {
    type: String, // Title field type
    required: true, // Title is required
  },
  description: {
    type: String, // Description field type
  },
  status: {
    type: String, // Status field type
    enum: ["To Do", "In Progress", "Completed"], // Enum for status
    required: true, // Status is required
  },
  priority: {
    type: String, // Priority field type
    enum: ["Low", "Medium", "High"], // Enum for priority
    required: true, // Priority is required
  },
  dueDate: {
    type: Date, // Due date field type
  },
  user: {
    type: String, // User field type
    required: true, // User is required
  },
});

export const TaskModel: Model<ITask> = mongoose.models.Task || mongoose.model("Task", TaskSchema); // Exporting the Task model
