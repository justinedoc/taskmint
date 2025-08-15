import NavActions from "@/components/landing-page/navbar/nav-actions";
import NavigationLinks from "@/components/landing-page/navbar/nav-links";
import { Link } from "@tanstack/react-router";

function Navbar() {
  return (
    <nav className="bg-background/10 sticky top-0 left-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-md">
      <Link to="/">
        <div className="flex items-center gap-0.5">
          <img src="/task-mint.svg" alt="Task mint logo" className="size-10" />
          <h1 className="font-heading text-2xl font-extrabold">
            Task<span className="text-primary">mint</span>
          </h1>
        </div>
      </Link>

      <div className="flex items-center gap-8">
        <NavigationLinks />
        <NavActions />
      </div>
    </nav>
  );
}

export default Navbar;
