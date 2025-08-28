import SidebarFooterMenu from "@/components/dashboard/sidebar/sidebar-footer-menu";
import SidebarMenus from "@/components/dashboard/sidebar/sidebar-menus";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";

export default function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="py-[1.01rem] group-data-[collapsible=icon]:my-[0.33rem]">
        <Link to="/" from="/dashboard">
          <img
            src="/taskmint-full.svg"
            alt="Task mint's logo"
            data-state={state}
            className="data-[state=collapsed]:hidden"
          />

          <img
            src="/taskmint-half.svg"
            alt="Task mint's logo"
            data-state={state}
            className="scale-100 data-[state=expanded]:hidden data-[state=expanded]:scale-0"
          />
        </Link>
      </SidebarHeader>

      <Separator />

      <SidebarContent className="mt-4">
        <SidebarGroup>
          <SidebarMenus />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarFooterMenu />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
