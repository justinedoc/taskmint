import Navbar from "@/components/dashboard/navbar";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  notFoundComponent: () => <div>Layout - not found</div>,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <Navbar />
        <div className="flex h-full w-full justify-between">
          <div className="flex-1 p-4 md:p-8">
            <Outlet />
          </div>
          <div className="min-w-[18rem] border-l" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
