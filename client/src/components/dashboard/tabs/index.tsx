import UpcomingTasksTab from "@/components/dashboard/tabs/upcoming-tasks";
import Box from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Route as DashboardRoute, TABS } from "@/routes/dashboard";
import { Link } from "@tanstack/react-router";
import { RotateCcw, SlidersHorizontal } from "lucide-react";

function DashboardTabs({ tab }: { tab: (typeof TABS)[number] }) {
  return (
    <Tabs defaultValue={tab} className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <TabTriggers />
        <Box className="md:gap-1 gap-0.5">
          <Button variant={"ghost"} size={"icon"}>
            <RotateCcw size={16} />
          </Button>
          <Button variant={"ghost"} size={"icon"}>
            <SlidersHorizontal size={16} />
          </Button>
        </Box>
      </div>

      <Separator className="bg-border/50" />

      <TabsContent value="upcoming">
        <UpcomingTasksTab />
      </TabsContent>

      <TabsContent value="board">Manage your task board here.</TabsContent>
      <TabsContent value="notes">View your notes here.</TabsContent>
    </Tabs>
  );
}

function TabTriggers() {
  return (
    <TabsList>
      {TABS.map((tab) => (
        <TabsTrigger key={tab} value={tab} className="capitalize">
          <Link to={DashboardRoute.to} search={(prev) => ({ ...prev, tab })}>
            {tab}
          </Link>
        </TabsTrigger>
      ))}
    </TabsList>
  );
}

export default DashboardTabs;
