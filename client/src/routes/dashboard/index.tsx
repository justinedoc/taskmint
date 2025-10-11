import DashboardTabs from "@/components/dashboard/tabs";
import UserProgress from "@/components/dashboard/user-progress";
import { useAuthStore } from "@/store/auth-store";
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
  const user = useAuthStore((s) => s.user);

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold">
          Hello {user?.fullname.split(" ").at(0)}
        </h1>
        <p className="text-muted-foreground">Let's make some progress today!</p>
      </div>

      <UserProgress />
      <DashboardTabs tab={tab} />
    </div>
  );
}
