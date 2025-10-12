import LongTermGoals from "@/components/dashboard/achievement-pie";
import ProductivityChart from "@/components/dashboard/performance-chart";
import Board from "@/components/dashboard/tabs/board";
import Notes from "@/components/dashboard/tabs/notes";
import UpcomingTasksTab from "@/components/dashboard/tabs/upcoming-tasks";
import Box from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Route as DashboardRoute, TABS } from "@/routes/dashboard";
import { Link } from "@tanstack/react-router";
import { RotateCcw, SlidersHorizontal } from "lucide-react";

export type ChartDataPoint = {
  label: string;
  value: number;
};

const chartData: ChartDataPoint[] = [
  { label: "16 Mar", value: 23 },
  { label: "17 Mar", value: 82 },
  { label: "18 Mar", value: 97 },
  { label: "19 Mar", value: 72 },
  { label: "20 Mar", value: 48 },
  { label: "21 Mar", value: 60 },
  { label: "22 Mar", value: 58 },
];

function DashboardTabs({ tab }: { tab: (typeof TABS)[number] }) {
  return (
    <Tabs defaultValue={tab} className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <TabTriggers />
        <Box className="gap-0.5 md:gap-1">
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
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
          <ProductivityChart data={chartData} />
          <LongTermGoals />
        </div>
      </TabsContent>

      <TabsContent value="board">
        <Board />
      </TabsContent>

      <TabsContent value="notes">
        <Notes />
      </TabsContent>
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
