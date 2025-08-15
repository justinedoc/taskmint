import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import {
  ComponentProps,
  createContext,
  PropsWithChildren,
  useContext,
} from "react";

interface TCardContext {
  plan: "free" | "pro" | "business";
  duration?: "monthly" | "yearly" | "weekly";
  currency?: string;
  features: string[];
}

const CardContext = createContext<TCardContext | undefined>(undefined);

const usePricingCardContext = () => {
  const context = useContext(CardContext);
  if (!context)
    throw new Error("Card context must be used in a Card context provider!");
  return context;
};

function PricingCard({
  duration = "monthly",
  currency = "$",
  features,
  plan,
  children,
  className,
  ...props
}: TCardContext & ComponentProps<typeof Card>) {
  return (
    <Card
      {...props}
      className={cn(
        "to-background rounded-2xl bg-gradient-to-b from-transparent p-6 shadow-2xl",
        {
          "from-background to-card scale-[1.05] bg-gradient-to-b shadow-none":
            plan === "pro",
        },
        className,
      )}
    >
      <CardContext.Provider value={{ duration, currency, features, plan }}>
        {children}
      </CardContext.Provider>
    </Card>
  );
}

PricingCard.Header = function PricingCardHeader({
  children,
}: PropsWithChildren) {
  return <div className="flex flex-col gap-4">{children}</div>;
};

PricingCard.SubHeader = function PricingCardSubHeader({
  children,
}: PropsWithChildren) {
  return (
    <div className="mb-4 flex items-center justify-between">{children}</div>
  );
};

PricingCard.Badge = function PricingCardBadge({ children }: PropsWithChildren) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold",
        "bg-[linear-gradient(0deg,#0b0710,_#0b0710)]",
        "ring-1 ring-white/10",
        "relative before:absolute before:-inset-px before:-z-10 before:rounded-full before:bg-gradient-to-r before:from-emerald-400/30 before:via-indigo-500/25 before:to-rose-400/20 before:content-['']",
      )}
      style={{ WebkitBackdropFilter: "blur(4px)" }}
    >
      <span className="text-[11px] tracking-wider uppercase">{children}</span>
    </span>
  );
};

PricingCard.Price = function PricingCardPrice({
  ...props
}: ComponentProps<typeof CardTitle>) {
  const { duration, currency } = usePricingCardContext();
  return (
    <CardTitle
      {...props}
      className={cn("flex items-baseline gap-1", props.className)}
    >
      <span className="font-heading text-5xl leading-none font-extrabold">{`${currency}${props.children}`}</span>
      <span className="text-muted-foreground text-sm font-medium">
        /{duration}
      </span>
    </CardTitle>
  );
};

PricingCard.Button = function PricingCardButton({
  ...props
}: ComponentProps<typeof Button>) {
  const { plan } = usePricingCardContext();
  return (
    <Button
      {...props}
      className={cn(
        plan !== "pro" &&
          `${buttonVariants({ variant: "outline" })} bg-transparent`,
        props.className,
      )}
    />
  );
};

PricingCard.FeaturesList = function PricingCardFeaturesList() {
  const { features } = usePricingCardContext();
  return (
    <ul className="space-y-4">
      {features.map((feature, i) => (
        <li
          key={i}
          className="text-muted-foreground flex items-center gap-4 text-sm"
        >
          <span className="ring-foreground/10 flex size-6 items-center justify-center rounded-full bg-transparent ring-1">
            <Check className="size-4" />
          </span>
          <span className="leading-relaxed">{feature}</span>
        </li>
      ))}
    </ul>
  );
};

export default PricingCard;
