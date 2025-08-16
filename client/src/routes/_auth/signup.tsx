import AuthFormTabs from "@/components/auth/auth-form-tabs";
import SignupForm from "@/components/auth/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Card className="mx-auto w-full max-w-sm md:mt-10">
      <CardHeader>
        <CardTitle className="font-heading text-4xl font-bold">
          Signup
        </CardTitle>
        <CardDescription>Join us and start enjoying tiny wins</CardDescription>
      </CardHeader>

      <CardContent>
        <AuthFormTabs FormComponent={SignupForm} />
      </CardContent>
    </Card>
  );
}
