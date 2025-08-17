import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { useLocation } from "@tanstack/react-router";
import React from "react";

const formatSegment = (segment: string) => {
  return segment
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char: string) => char.toUpperCase());
};

export default function DashboardBreadcrumb() {
  const { pathname } = useLocation();

  const segments = pathname ? pathname.split("/").filter(Boolean) : [];

  const paths = segments.map((_, idx) => {
    return `/${segments.slice(0, idx + 1).join("/")}`;
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, idx) => {
          const isLast = idx === segments.length - 1;
          const title = formatSegment(segment);

          return (
            <React.Fragment key={paths[idx]}>
              <BreadcrumbItem key={paths[idx]}>
                {isLast ? (
                  <BreadcrumbPage>
                    <TextShimmer duration={3}>{title}</TextShimmer>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={paths[idx]}>{title}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator
                data-is-last={isLast}
                className="hidden data-[is-last=true]:hidden md:block"
              />
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
