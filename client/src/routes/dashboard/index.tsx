import DashboardTabs from "@/components/dashboard/tabs";
import UserProgress from "@/components/dashboard/user-progress";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod";

export const TABS = ["upcoming", "board", "notes"] as const;

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
  validateSearch: zodValidator(
    z.object({
      tab: z.enum(TABS).default(TABS[0]),
    }),
  ),
});

function Dashboard() {
  const { tab } = Route.useSearch();

  return (
    <div className="space-y-6 w-full">
      <UserProgress />
      <DashboardTabs tab={tab} />
    </div>
  );
}
