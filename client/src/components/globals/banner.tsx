import Box from "@/components/ui/box";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

function Banner({ ...props }: ComponentProps<"section">) {
  return (
    <section
      {...props}
      className={cn(
        "bg-hero-grad relative z-0 flex min-h-[32rem] w-full items-center overflow-hidden rounded-md md:items-start md:justify-center",
        props.className,
      )}
    />
  );
}

Banner.Header = function ({ ...props }: ComponentProps<typeof Box>) {
  return (
    <Box
      {...props}
      wrap={false}
      className={cn(
        "mx-auto flex-col items-center gap-4 text-center w-full md:mt-20 md:max-w-[45rem]",
        props.className,
      )}
    />
  );
};

Banner.Title = function ({ ...props }: ComponentProps<"h1">) {
  return (
    <h1
      {...props}
      className={cn(
        "bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-300 bg-clip-text text-center text-6xl font-extrabold text-transparent md:text-8xl",
        props.className,
      )}
    />
  );
};

Banner.Description = function ({ ...props }: ComponentProps<"p">) {
  return (
    <p
      {...props}
      className={cn(
        "text-foreground/70 mx-auto mt-2 w-full text-center text-base md:max-w-md",
        props.className,
      )}
    />
  );
};

Banner.CTA = function ({ ...props }: ComponentProps<typeof Box>) {
  return (
    <Box {...props} wrap={false} className={cn("mt-2", props.className)} />
  );
};

Banner.OverlayImg = function ({ ...props }: ComponentProps<"img">) {
  return (
    <img
      {...props}
      alt="Overlay image"
      draggable={false}
      className={cn("absolute -z-10", props.className)}
    />
  );
};

export default Banner;
