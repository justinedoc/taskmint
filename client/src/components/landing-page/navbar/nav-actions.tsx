import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

function NavActions() {
  return (
    <div className="flex items-center gap-4">
      <Button size="lg">
        Get Started <ArrowRight />
      </Button>

      <Button variant={"outline"} size="lg">
        Sign In
      </Button>
    </div>
  );
}

export default NavActions;
