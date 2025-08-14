import Footer from "@/components/landing-page/footer";
import Hero from "@/components/landing-page/hero";
import Navbar from "@/components/landing-page/navbar";
import { createFileRoute } from "@tanstack/react-router";
// import { hcWithType } from "server/dist/client";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="relative">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}

export default Index;
