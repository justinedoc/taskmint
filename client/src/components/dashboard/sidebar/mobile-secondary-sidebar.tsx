import SecondarySidebarContent from "@/components/dashboard/sidebar/secondary-sidebar-content";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { EllipsisVertical } from "lucide-react";

function MobileSecondarySidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden">
          <EllipsisVertical />
        </Button>
      </SheetTrigger>
      <SheetContent className="py-4">
        <SecondarySidebarContent />
      </SheetContent>
    </Sheet>
  );
}

export default MobileSecondarySidebar;
