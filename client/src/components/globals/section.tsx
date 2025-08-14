import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

function Section({ className, children, ...props }: ComponentProps<"section">) {
  return (
    <section
      {...props}
      className={cn(
        "mx-auto px-4 py-12 md:max-w-[80rem] md:px-24 md:py-15",
        className,
      )}
    >
      {children}
    </section>
  );
}

Section.Header = function SectionHeader({
  className,
  ...props
}: ComponentProps<"header">) {
  return (
    <header
      {...props}
      className={cn(
        "mx-auto mb-6 flex flex-col items-center gap-2 md:mb-10",
        className,
      )}
    />
  );
};

Section.Title = function SectionTitle({
  className,
  ...props
}: ComponentProps<"h2">) {
  return (
    <h2
      {...props}
      className={cn(
        "text-center text-3xl font-bold md:text-4xl md:tracking-wide",
        className,
      )}
    />
  );
};

Section.Description = function SectionDescription({
  className,
  ...props
}: ComponentProps<"p">) {
  return (
    <p
      {...props}
      className={cn(
        "text-muted-foreground max-w-[32rem] text-center text-sm leading-relaxed",
        className,
      )}
    />
  );
};

Section.Body = function SectionBody({
  className,
  ...props
}: ComponentProps<"div">) {
  return <div {...props} className={cn("mx-auto md:max-w-[90%]", className)} />;
};

Section.displayName = "Section";

export default Section;
