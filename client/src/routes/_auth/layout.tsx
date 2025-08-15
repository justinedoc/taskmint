import { Button } from "@/components/ui/button";
import DotPattern from "@/components/ui/dot-pattern";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <section className="from-background to-card relative z-0 flex min-h-screen items-center justify-center bg-gradient-to-tl p-4">
      <DotPattern />

      <Button
        asChild
        size="icon"
        variant="outline"
        className="absolute top-2 left-2 [&_svg]:group-hover:-translate-x-0.5!"
      >
        <Link to="..">
          <ChevronLeft />
        </Link>
      </Button>

      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

      <Outlet />
    </section>
  );
}
