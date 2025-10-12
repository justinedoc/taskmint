import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/hooks/use-user";
import { Navigate } from "@tanstack/react-router";
import { PropsWithChildren } from "react";

function AuthProvider({ children }: PropsWithChildren) {
  const { isLoading, isError } = useUser();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if(isError) return <Navigate to="/" />

  return <>{children}</>;
}

export default AuthProvider;
