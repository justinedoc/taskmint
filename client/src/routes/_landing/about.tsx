import Faqs from "@/components/landing-page/faqs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing/about")({
  component: About,
});

function About() {
  return (
    <>
      <h1>About</h1>
      <Faqs />
    </>
  );
}
