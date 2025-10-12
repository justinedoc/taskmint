import { getCurrentUser } from "@/data/get-current-user";
import { useAuthStore } from "@/store/auth-store";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const userQueryOptions = () => {
  const isAuthed = useAuthStore.getState().isAuthed;

  return queryOptions({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    staleTime: Infinity,
    retry: false,
    enabled: isAuthed,
  });
};

export const useUser = () => useQuery(userQueryOptions());
