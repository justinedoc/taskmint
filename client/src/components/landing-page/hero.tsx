import Banner from "@/components/globals/banner";
import { Button } from "@/components/ui/button";
// import GridPattern from "@/components/ui/grid-pattern";
import Tag from "@/components/ui/tag";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";

function Hero() {
  return (
    <Banner>
      {/* <GridPattern /> */}

      <Banner.Header>
        <Tag>
          <TextShimmer className="font-mono text-sm">
            celebrate tiny wins
          </TextShimmer>
        </Tag>

        <Banner.Title className="font-heading py-2">
          One Task. <br />
          Big Momentum.
        </Banner.Title>

        <Banner.Description>
          Track progress, celebrate tiny wins, and stay focused — one task at a
          time.
        </Banner.Description>

        <Banner.CTA>
          <Link to="/signin">
            <Button size="lg">
              Get Started <ArrowRight />
            </Button>
          </Link>

          <Link to="/">
            <Button variant="outline" size="lg">
              How It Works <ArrowUpRight />
            </Button>
          </Link>
        </Banner.CTA>
      </Banner.Header>

      <Banner.OverlayImg
        src={"src/assets/images/hero-ellipse.png"}
        alt="Hero overlay"
        loading="eager"
        height={800}
        className="-bottom-4 left-1/2 -translate-x-1/2"
      />
    </Banner>
  );
}

export default Hero;
