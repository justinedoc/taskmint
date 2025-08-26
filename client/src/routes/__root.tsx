import { Toaster } from "@/components/ui/sonner";
import { AuthState } from "@/store/auth-store";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

interface RouterContext {
  auth: AuthState;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <HeadContent />
      <Outlet />
      <Toaster richColors theme="dark" position="top-right" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  ),
});
