import DashboardBreadcrumb from "@/components/dashboard/dashboard-breadcrumb";
import MobileSecondarySidebar from "@/components/dashboard/sidebar/mobile-secondary-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Box from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getInitials } from "@/lib/get-name-initials";
import { useAuthStore } from "@/store/auth-store";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Search, Settings } from "lucide-react";

function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((s) => s.logout);

  if (!user) return null;

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

        <Popover>
          <Box className="hover:bg-secondary cursor-pointer gap-2 rounded-md p-1 text-sm font-medium transition-colors duration-300">
            <Button variant={"outline"} size={"sm"} className="md:hidden">
              <Search size={16} />
            </Button>

            <MobileSecondarySidebar />

            <PopoverTrigger asChild>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={user?.profileImg} />
                  <AvatarFallback>{getInitials(user.fullname)}</AvatarFallback>
                </Avatar>
                <h2 className="line-clamp-1 hidden md:block">
                  {user.fullname}
                </h2>
                <ChevronDown size={16} />
              </div>
            </PopoverTrigger>
          </Box>
          <PopoverContent className="w-80!">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="text-xl leading-none font-medium">Profile</h4>
                <p className="text-muted-foreground text-sm">
                  Manage your profile.
                </p>
              </div>
              <div className="grid gap-2">
                <Link
                  to="/dashboard/settings"
                  className="hover:bg-accent/50 inline-flex gap-2 rounded-md px-2 py-3"
                >
                  <Settings /> Settings
                </Link>

                <Button variant={"destructive"} onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}

export default Navbar;
