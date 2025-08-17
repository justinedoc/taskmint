import Logo from "@/components/globals/logo";
import NavActions from "@/components/landing-page/navbar/nav-actions";
import NavigationLinks from "@/components/landing-page/navbar/nav-links";

function Navbar() {
  return (
    <nav className="bg-background/10 sticky top-0 left-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-md">
      <Logo />

      <div className="flex items-center gap-8">
        <NavigationLinks />
        <NavActions />
      </div>
    </nav>
  );
}

export default Navbar;
