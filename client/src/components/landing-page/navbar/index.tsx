import NavActions from "@/components/landing-page/navbar/nav-actions";
import NavigationLinks from "@/components/landing-page/navbar/nav-links";
import { useIsMobile } from "@/hooks/use-mobile";

function Navbar() {
  const isMobile = useIsMobile();
  return (
    <nav className="bg-background/10 sticky top-0 left-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-md">
      <img
        src="/taskmint-full.svg"
        alt="Task mint's logo"
        data-state={isMobile}
        className="data-[state=true]:hidden"
      />

      <img
        src="/taskmint-half.svg"
        alt="Task mint's logo"
        data-state={isMobile}
        className="scale-100 data-[state=expanded]:scale-0 data-[state=false]:hidden"
      />
      <div className="flex items-center gap-8">
        <NavigationLinks />
        <NavActions />
      </div>
    </nav>
  );
}

export default Navbar;
