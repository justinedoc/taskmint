import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, LucideIcon, Settings } from "lucide-react";

const baseUrl = "/dashboard";

type SidebarMenus = {
  item: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
};

const data: SidebarMenus = {
  item: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      url: baseUrl,
    },
    {
      title: "Settings",
      icon: Settings,
      url: "/dashboard/settings",
    },
  ],
};

function SidebarMenus() {
  const { pathname } = useLocation();

  function isActive(url: string) {
    return pathname.endsWith(url);
  }

  return (
    <SidebarMenu>
      {data.item.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton isActive={isActive(item.url)} asChild>
            <Link to={item.url}>
              <item.icon />
              {item.title}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export default SidebarMenus;
