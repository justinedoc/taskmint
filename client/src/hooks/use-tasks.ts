import { AllTasksQuery, getTasks } from "@/data/get-tasks";
import { useQuery } from "@tanstack/react-query";

export const useTasks = (queries?: AllTasksQuery) => {
  return useQuery({
    queryKey: ["tasks", queries],
    queryFn: () => getTasks(queries),
    staleTime: 5 * 60 * 1000,
  });
};
