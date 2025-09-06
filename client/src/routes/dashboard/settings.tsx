import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <Settings className="mt-2" />
        <div className="">
          <h2 className="text-4xl font-semibold">Settings</h2>
          <p className="text-muted-foreground text-sm">
            Customize your experince and preference
          </p>
        </div>
      </div>
    </div>
  );
}
