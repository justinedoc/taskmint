import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

function NavActions() {
  return (
    <div className="flex items-center gap-4">
      <Button size="lg">
        Get Started <ArrowRight />
      </Button>

      <Button asChild variant={"outline"} size="lg">
        <Link to="/signin">Sign In</Link>
      </Button>
    </div>
  );
}

export default NavActions;
