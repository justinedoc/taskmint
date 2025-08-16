import ResetPasswordForm from "@/components/auth/reset-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod";

export const Route = createFileRoute("/_auth/reset-password")({
  component: RouteComponent,
  validateSearch: zodValidator(z.object({ token: z.string().optional() })),
});

function RouteComponent() {
  const { token } = Route.useSearch();

  if (!token) return <Navigate to="/" />;

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="font-heading text-3xl font-bold">
          Reset Password
        </CardTitle>
        <CardDescription>Enter your new credentials</CardDescription>
      </CardHeader>

      <CardContent>
        <ResetPasswordForm token={token} />
      </CardContent>
    </Card>
  );
}
