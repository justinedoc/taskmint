import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing/")({
  component: Index,
});

function Index() {
  return <Outlet />;
}