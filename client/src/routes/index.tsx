import Cooperations from "@/components/landing-page/cooperations";
import Faqs from "@/components/landing-page/faqs";
import Features from "@/components/landing-page/features";
import Footer from "@/components/landing-page/footer";
import Hero from "@/components/landing-page/hero";
import Interface from "@/components/landing-page/interface";
import Navbar from "@/components/landing-page/navbar";
import { createFileRoute } from "@tanstack/react-router";
// import { hcWithType } from "server/dist/client";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <Navbar />
      <Hero />
      <Cooperations />
      <Features />
      <Interface />
      <Faqs />
      <Footer />
    </>
  );
}

export default Index;
