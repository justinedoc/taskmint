import { buttonVariants } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

function NavActions() {
  return (
    <div className="flex items-center gap-4">
      <Link to="/signup" className={buttonVariants({ size: "lg" })}>
        Get Started <ArrowRight />
      </Link>

      <Link
        to="/signin/modal"
        className={buttonVariants({ variant: "outline", size: "lg" })}
      >
        Sign In
      </Link>
    </div>
  );
}

export default NavActions;
