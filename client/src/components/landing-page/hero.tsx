import Banner from "@/components/globals/banner";
import { Button } from "@/components/ui/button";
import GridPattern from "@/components/ui/grid-pattern";
import { Spotlight } from "@/components/ui/spotlight";
import Tag from "@/components/ui/tag";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Link } from "@tanstack/react-router";

function Hero() {
  return (
    <div>
      <Banner>
        <GridPattern />

        <Spotlight
          className="-top-20 -left-35 md:-top-10 md:left-20"
          fill="#4f21a1"
        />

        <Banner.Header>
          <Link to="/">
            <Tag>
              <TextShimmer className="font-mono text-sm">
                Organizing the chaos...
              </TextShimmer>
            </Tag>
          </Link>

          <Banner.Title className="py-2">
            Stay Aligned <br />
            Stay Connected.
          </Banner.Title>
          <Banner.Description>
            Unify your organization's knowledge and execution in one
            intelligent, real-time workspace.
          </Banner.Description>
          <Banner.CTA>
            <Link to="/signin">
              <Button size="lg">Get Started</Button>
            </Link>

            <Link to="/">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </Banner.CTA>
        </Banner.Header>

        <Banner.OverlayImg
          src={"/images/hero-overlay.png"}
          alt="Hero overlay"
          loading="eager"
          width={1000}
          height={1000}
          className="top-50 left-1/2 w-[120%] -translate-x-1/2 md:top-40 md:w-[70%]"
        />
      </Banner>

      <div className="relative mx-auto mt-4 md:mt-8 md:max-w-[60rem]">
        <img
          src={"/images/dashboard-img_2.png"}
          alt="Dashboard Image of cellar"
          width={1000}
          height={1000}
          loading="eager"
          className="rounded-lg border shadow-xl"
        />
      </div>
    </div>
  );
}

export default Hero;
