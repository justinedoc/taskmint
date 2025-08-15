import Section from "@/components/globals/section";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { featuresInfo, FeaturesTypes } from "@/constants/features";

function Features() {
  return (
    <Section className="bg-background min-h-screen">
      <Section.Header>
        <Section.Title>Everything you need</Section.Title>
        <Section.Description>
          Set tasks, Get reminders, and See your progress simply and quickly.
        </Section.Description>
      </Section.Header>

      <Section.Body className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {featuresInfo.map((f) => (
          <FeaturesCard key={f.title} features={f} />
        ))}
      </Section.Body>
    </Section>
  );
}
function FeaturesCard({ features }: { features: FeaturesTypes }) {
  return (
    <Card className="flex w-full max-w-sm md:last:col-span-3 md:last:mx-auto">
      <CardHeader className="grid place-items-center">
        <div className="bg-foreground flex size-12 items-center justify-center rounded-full">
          {<features.icon className="text-background" />}
        </div>
        <CardTitle className="text-center text-xl">{features.title}</CardTitle>
        <CardDescription className="text-center text-pretty">
          {features.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
export default Features;
