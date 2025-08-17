import DashboardBreadcrumb from "@/components/dashboard/dashboard-breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Box from "@/components/ui/box";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronDown, Search } from "lucide-react";

function Navbar() {
  return (
    <nav className="bg-background sticky top-0 flex h-16 w-full shrink-0 items-center gap-2 border-b px-4">
      
      <SidebarTrigger className="-ml-1" />

      <Separator orientation="vertical" className="mr-2 h-4!" />

      <DashboardBreadcrumb />

      <div className="ml-auto flex max-w-2xl flex-1 items-center justify-between gap-6">
        <div className="relative flex-1">
          <Input placeholder="Search for anything..." className="pl-8" />
          <Search
            size={16}
            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
          />
        </div>


        <Box className="hover:bg-secondary cursor-pointer gap-2 rounded-md p-1 transition-colors duration-300">
          <Avatar>
            {/* FIXME: update import */}
            <AvatarImage src="/src/assets/images/testimonial_2.png" />
            <AvatarFallback>OJ</AvatarFallback>
          </Avatar>
          <h2 className="line-clamp-1 text-sm font-medium">Onyriuka Justin</h2>
          <ChevronDown size={16} />
        </Box>
      </div>
    </nav>
  );
}

export default Navbar;
