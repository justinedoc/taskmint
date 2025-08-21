import { Toaster } from "@/components/ui/sonner";
import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <HeadContent />
      <Outlet />
      <Toaster richColors theme="dark" position="top-right" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  ),
});
