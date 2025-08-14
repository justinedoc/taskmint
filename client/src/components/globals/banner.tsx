import Box from "@/components/ui/box";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

function Banner({ ...props }: ComponentProps<"section">) {
  return (
    <section
      {...props}
      className={cn(
        "relative z-0 flex h-[40rem] w-full items-center overflow-hidden rounded-md bg-black/[0.96] md:justify-center",
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
        "mx-auto flex-col items-center gap-4 text-center md:mt-20 md:max-w-[45rem]",
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
        "bg-opacity-50 font-base bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-4xl font-extrabold text-transparent md:text-7xl",
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
        "text-foreground/70 mx-auto mt-2 max-w-lg text-center text-base",
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
