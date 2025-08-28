import Navbar from "@/components/dashboard/navbar";
import DashboardSidebar from "@/components/dashboard/sidebar";
import SecondarySidebar from "@/components/dashboard/sidebar/secondary-sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/auth-store";
import {
  createFileRoute,
  Navigate,
  Outlet,
  redirect,
} from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthed || !context.auth.isOtpVerified) {
      throw redirect({ to: "/signin" });
    }
  },
  component: Dashboard,
  pendingComponent: () => <div>Loading...</div>,
  notFoundComponent: () => <div>Layout - not found</div>,
});

function Dashboard() {
  const isAuthed = useAuthStore((s) => s.isAuthed);

  if (!isAuthed) {
    return <Navigate to="/signin" />;
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <Navbar />

        <ResizablePanelGroup
          direction="horizontal"
          className="hidden! flex-1 md:flex!"
        >
          <ResizablePanel className="flex-1 p-8">
            <Outlet />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={32} minSize={32} maxSize={38}>
            <SecondarySidebar />
          </ResizablePanel>
        </ResizablePanelGroup>

        <div className="flex w-full p-4 md:hidden">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
