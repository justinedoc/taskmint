import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "text-muted-foreground inline-flex h-9 w-fit items-center justify-center gap-4 rounded-lg bg-transparent p-[3px] font-medium",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Base styles
        "relative inline-flex flex-1 items-center justify-center gap-1.5 px-4 py-1 pb-2",
        "text-sm font-medium whitespace-nowrap transition-[color,box-shadow]",
        "rounded-md border border-transparent overflow-x-hidden",
        "text-foreground dark:text-muted-foreground",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",

        // Focus / disabled
        "focus-visible:outline-1 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-50",

        // Active state
        "data-[state=active]:bg-background data-[state=active]:shadow-sm",
        "dark:data-[state=active]:bg-input/30 dark:data-[state=active]:border-input border-0",
        "dark:data-[state=active]:text-foreground",

        // Decorative underline animation
        "before:absolute before:-bottom-0 before:left-1/2 before:h-0.5 before:w-[90%]",
        "before:translate-x-[-153%] before:rounded-2xl before:bg-primary",
        "before:transition-all before:duration-300 before:ease-in-out before:will-change-transform before:content-['']",
        "data-[state=active]:before:-translate-x-1/2 dark:data-[state=active]:bg-transparent",

        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
