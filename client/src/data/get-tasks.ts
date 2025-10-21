import { API } from "@/api/axios";
import { ApiResponse, User } from "@/types";

export type Task = {
  _id: string;
  title: string;
  status: "not started" | "in progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: Date;
  completed: boolean;
  description?: string | undefined;
  user: Pick<User, "id" | "fullname" | "email" | "role" | "username">;
};

export type AllTasksQuery = {
  page?: number;
  limit?: number;
  sortBy?: "title" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  completed?: boolean;
  status?: "completed" | "not started" | "in progress";
  priority?: "low" | "moderate" | "extreme";
  dueDate?: string | Date;
};

export type Meta = {
  total: number;
  nextPage: number | null;
  prevPage: number | null;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getTasks(
  params?: AllTasksQuery,
): Promise<ApiResponse<{ tasks: Task[]; meta: Meta[] }>> {
  const res = await API.get("/tasks", {
    params,
  });
  return res.data;
}
