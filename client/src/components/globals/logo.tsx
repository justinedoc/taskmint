import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ClassValue } from "clsx";

function Logo({
  className,
  src = "/task-mint.svg",
  ...props
}: {
  className?: ClassValue;
  src?: string;
}) {
  return (
    <>
      <Link to="/" className="flex items-center gap-1">
        <img
          width={50}
          height={50}
          {...props}
          src={src}
          alt="Task mint's logo"
          loading="eager"
          className={cn(className)}
        />

        <h1 className="text-2xl font-extrabold group-data-[collapsible=icon]:hidden">
          Task<span className="text-primary">mint</span>
        </h1>
      </Link>
    </>
  );
}

export default Logo;
