import NavActions from "@/components/landing-page/navbar/nav-actions";
import NavigationLinks from "@/components/landing-page/navbar/nav-links";
import { useIsMobile } from "@/hooks/use-mobile";

function Navbar() {
  const isMobile = useIsMobile();
  return (
    <nav className="bg-background/8 sticky top-0 left-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-sm">
      <div className="flex items-center gap-1">
        <img
          src="/taskmint-half.svg"
          alt="Task mint's logo"
          data-state={isMobile}
          className="size-10"
        />
        <h1 className="text-3xl font-extrabold">
          Task<span className="text-primary">mint</span>
        </h1>
      </div>

      <div className="flex items-center gap-8">
        <NavigationLinks />
        <NavActions />
      </div>
    </nav>
  );
}

export default Navbar;
