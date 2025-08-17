import SidebarFooterMenu from "@/components/dashboard/sidebar/sidebar-footer-menu";
import SidebarMenus from "@/components/dashboard/sidebar/sidebar-menus";
import Logo from "@/components/globals/logo";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export default function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="mb-2 py-3.5">
        <Logo />

        <Separator />
      </SidebarHeader>

      <SidebarContent>
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
