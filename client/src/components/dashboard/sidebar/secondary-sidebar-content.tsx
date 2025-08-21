import DashboardCalendar from "@/components/dashboard/dashboard-calendar";
import Notifications from "@/components/dashboard/notifications";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Calendar } from "lucide-react";

const TABS_Header = [
  {
    label: Calendar,
    value: "calendar",
  },
  {
    label: Bell,
    value: "notifications",
  },
];

function SecondarySidebarContent() {
  return (
    <Tabs defaultValue="calendar" className="w-full! p-4">
      <TabsList className="ml-auto">
        {TABS_Header.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="dark:data-[state=active]:text-primary p-2 before:hidden"
          >
            {<tab.label size={16} />}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="calendar">
        <DashboardCalendar />
      </TabsContent>
      <TabsContent value="notifications">
        <Notifications />
      </TabsContent>
    </Tabs>
  );
}

export default SecondarySidebarContent;
