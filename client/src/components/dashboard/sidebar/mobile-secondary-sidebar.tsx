import SecondarySidebarContent from "@/components/dashboard/sidebar/secondary-sidebar-content";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EllipsisVertical } from "lucide-react";

function MobileSecondarySidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden">
          <EllipsisVertical />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Secondary Sidebar</SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <SecondarySidebarContent />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileSecondarySidebar;
