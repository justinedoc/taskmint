import { router } from "@/main";
import { useAuthStore } from "@/store/auth-store";
import { RouterProvider } from "@tanstack/react-router";

export default function App() {
  const auth = useAuthStore();
  return <RouterProvider router={router} context={{ auth }} />;
}
