import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

function GridPattern({ className }: { className?: ClassValue }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
        "-z-10 [background-image:linear-gradient(to_right,#171717be_1px,transparent_1px),linear-gradient(to_bottom,#171717be_1px,transparent_1px)]",
        className,
      )}
    />
  );
}

export default GridPattern;
