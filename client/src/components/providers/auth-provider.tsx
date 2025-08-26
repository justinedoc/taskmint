import { useAuthStore } from "@/store/auth-store";
import { PropsWithChildren, useEffect } from "react";

function AuthProvider({ children }: PropsWithChildren) {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return <>{children}</>;
}

export default AuthProvider;
