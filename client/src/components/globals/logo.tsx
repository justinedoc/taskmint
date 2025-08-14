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
      <Link to="/">
        <img
          width={90}
          height={90}
          {...props}
          src={src}
          alt="Task mint's logo"
          loading="eager"
          className={cn(className)}
        />
      </Link>
    </>
  );
}

export default Logo;
