import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

type BoxProps = {
  children: React.ReactNode;
  className?: ClassValue;
  wrap?: boolean;
};

function Box({ children, className, wrap = false }: BoxProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        { "flex-wrap": wrap },
        className
      )}
    >
      {children}
    </div>
  );
}

export default Box;
