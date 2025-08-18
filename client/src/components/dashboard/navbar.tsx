import DashboardBreadcrumb from "@/components/dashboard/dashboard-breadcrumb";
import MobileSecondarySidebar from "@/components/dashboard/sidebar/mobile-secondary-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Box from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronDown, Search } from "lucide-react";

function Navbar() {
  return (
    <nav className="bg-background sticky top-0 z-[50] flex h-16 w-full shrink-0 items-center gap-6 border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 rotate-180 md:rotate-[initial]" />

        <Separator orientation="vertical" className="mr-2 h-4!" />

        <DashboardBreadcrumb />
      </div>

      <div className="ml-auto flex flex-1 items-center justify-end gap-6 md:justify-between">
        <div className="relative ml-auto hidden max-w-xl flex-1 md:flex">
          <Input placeholder="Search for anything..." className="pl-8" />
          <Search
            size={16}
            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
          />
        </div>

        <Box className="hover:bg-secondary cursor-pointer gap-2 rounded-md p-1 text-sm font-medium transition-colors duration-300">
          <Button variant={"outline"} size={"sm"} className="md:hidden">
            <Search size={16} />
          </Button>
          
          <MobileSecondarySidebar />
          <Avatar>
            <AvatarImage src="/src/assets/images/testimonial_2.png" />
            <AvatarFallback>OJ</AvatarFallback>
          </Avatar>
          <h2 className="line-clamp-1 hidden md:block">Onyriuka Justin</h2>
          <ChevronDown size={16} />
        </Box>
      </div>
    </nav>
  );
}

export default Navbar;
