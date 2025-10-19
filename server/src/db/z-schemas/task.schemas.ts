import { TASK_PRIORITY } from "@shared/types";
import { isValidObjectId, Types } from "mongoose";
import z from "zod";

export const zTask = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(1)
    .max(200, { error: "Title cannot be more than 200 characters" }),
  description: z.string().optional(),
  status: z
    .enum(["not started", "in progress", "completed"])
    .default("not started"),
  priority: z.enum(TASK_PRIORITY),

  dueDate: z.coerce.date(),
  completed: z.boolean().default(false),
});

export const zTasksParams = z.object({
  search: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  sortBy: z.enum(["title", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  completed: z.coerce.boolean().optional(),
  status: z.enum(["not started", "in progress", "completed"]).optional(),
  priority: z.enum(["low", "moderate", "extreme"]).optional(),
  dueDate: z.coerce.date().optional(),
});

export const zTaskById = z.object({
  taskId: z.string().refine(isValidObjectId, { message: "Invalid task ID" }),
});

export type BaseTask = z.infer<typeof zTask> & {
  _id: Types.ObjectId;
  user: Types.ObjectId;
};

export type TaskListMeta = {
  total: number;
  nextPage: number | null;
  prevPage: number | null;
  page: number;
  limit: number;
  totalPages: number;
};

export type TaskListResponse = {
  tasks: BaseTask[];
  meta: TaskListMeta;
};
