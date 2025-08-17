import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings")({
  component: Dashboard,
});

function Dashboard() {
  return <div>Hello "/_dashboard/settings"!</div>;
}
