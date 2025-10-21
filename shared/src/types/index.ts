import { z } from "zod";
import { zTasksParams } from "@server/db/z-schemas/task.schemas";

export type ApiResponse = {
  message: string;
  success: true;
}

export type AllTasksQuery = z.infer<typeof zTasksParams>;

export const TASK_PRIORITY = ["low", "medium", "high"] as const;
