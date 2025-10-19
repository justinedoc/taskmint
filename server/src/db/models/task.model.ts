import { type BaseTask } from "@server/db/z-schemas/task.schemas";
import { TASK_PRIORITY } from "@shared/types";
import mongoose, { Document, Schema } from "mongoose";

export type mTask = BaseTask & Document;

const mTaskSchema = new mongoose.Schema<mTask>(
  {
    title: { type: String, required: true },
    status: String,
    description: String,
    priority: { type: String, enum: TASK_PRIORITY, required: true },
    dueDate: { type: Date, required: true },
    completed: { type: Boolean, required: true, default: false },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const TaskModel = mongoose.model<mTask>("Task", mTaskSchema);

export default TaskModel;
