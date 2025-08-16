import AuthFormTabs from "@/components/auth/auth-form-tabs";
import SigninForm from "@/components/auth/signin-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/signin")({
  component: Signin,
});

function Signin() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="font-heading text-4xl font-bold">
          Signin
        </CardTitle>
        <CardDescription>
          Welcome back!, let continue where we left off
        </CardDescription>
      </CardHeader>

      <CardContent>
        <AuthFormTabs FormComponent={SigninForm} />
      </CardContent>
    </Card>
  );
}
