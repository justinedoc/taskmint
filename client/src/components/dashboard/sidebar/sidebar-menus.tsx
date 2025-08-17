import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight, LayoutDashboard, LucideIcon } from "lucide-react";

const baseUrl = "/dashboard";

type SidebarMenus = {
  item: {
    title: string;
    url?: string;
    icon: LucideIcon;
    items?: {
      title: string;
      url: string;
      icon: LucideIcon;
    }[];
  }[];
};

const data: SidebarMenus = {
  item: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      url: baseUrl,
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
      {data.item.map((item) =>
        item.items ? (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={true}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton size="lg" tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        isActive={isActive(subItem.url)}
                        size="md"
                        asChild
                      >
                        <Link to={subItem.url}>
                          {subItem.icon && <subItem.icon />}
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ) : (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              isActive={isActive(item.url || "")}
              size={"lg"}
              asChild
            >
              <Link to={item.url || "#"}>
                {item.icon && <item.icon />}
                {item.title}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ),
      )}
    </SidebarMenu>
  );
}

export default SidebarMenus;
