import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ClassValue } from "clsx";
import { ComponentProps } from "react";

function Logo({ className }: { className?: ClassValue; src?: string }) {
  return (
    <>
      <Link to="/">
        <SVGComponent className={cn(className)} />
      </Link>
    </>
  );
}

const SVGComponent = ({ ...props }: ComponentProps<"svg">) => (
  <svg
    width={249}
    height={40}
    viewBox="0 0 249 40"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <style>{'.logo-text{font:800 28px/1"Inter",sans-serif}'}</style>
    <path
      d="M39.2 32c6.627 0 12-5.373 12-12s-5.373-12-12-12c-6.22 0-11.334 4.732-11.94 10.793a22.5 22.5 0 0 0-7.813-1.947C20.96 7.3 29.227 0 39.2 0c11.046 0 20 8.954 20 20 0 10.643-8.313 19.344-18.8 19.965V40H27.22v-1.745c0-2.268-.936-4.473-2.65-6.121-1.718-1.654-4.08-2.607-6.57-2.607s-4.852.953-6.57 2.607c-1.714 1.648-2.65 3.853-2.65 6.12V40H0v-1.788c0-4.675 1.94-9.121 5.333-12.372 3.285-3.147 7.672-4.93 12.238-5.035a19 19 0 0 1 .761-.002c4.601.082 9.027 1.868 12.335 5.037A17.4 17.4 0 0 1 34.816 32z"
      fill="#4E20A1"
    />
    <path
      d="M21.677 34.925c.975.848 1.523 1.998 1.523 3.197V40H12.8v-1.878c0-1.2.548-2.35 1.523-3.197.975-.849 2.298-1.325 3.677-1.325s2.702.476 3.677 1.325m22.105-16.889a2.62 2.62 0 0 1-2.618-2.618v-.654a1.964 1.964 0 0 0-3.928 0v.654a2.62 2.62 0 0 1-2.618 2.618h-.654a1.964 1.964 0 0 0 0 3.928h.654a2.62 2.62 0 0 1 2.618 2.618v.654a1.964 1.964 0 1 0 3.928 0v-.654a2.62 2.62 0 0 1 2.618-2.618h.654a1.964 1.964 0 1 0 0-3.928zM11.2 3.2a3.2 3.2 0 0 0 3.2 3.2h.8a2.4 2.4 0 1 1 0 4.8h-.8a3.2 3.2 0 0 0-3.2 3.2v.8a2.4 2.4 0 1 1-4.8 0v-.8a3.2 3.2 0 0 0-3.2-3.2h-.8a2.4 2.4 0 1 1 0-4.8h.8a3.2 3.2 0 0 0 3.2-3.2v-.8a2.4 2.4 0 0 1 4.8 0z"
      fill="#4E20A1"
    />
    <text x={65} y={39} className="logo-text" fill="#FFF">
      {"Task"}
    </text>
    <text x={130} y={39} className="logo-text" fill="#4E20A1">
      {"mint"}
    </text>
  </svg>
);

export default Logo;
