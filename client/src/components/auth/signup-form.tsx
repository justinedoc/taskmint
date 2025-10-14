import { FormTabs } from "@/components/auth/auth-form-tabs";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/ui/password-input";
import { PlanName } from "@/constants/pricing";
import { parseAxiosError } from "@/lib/parse-axios-error";
import { useAuthStore } from "@/store/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { error: "fullname is required" }),
  email: z.email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .regex(/.{6,}/, { error: "Password must be at least 6 characters" })
    .regex(/[0-9]/, { error: "Password must contain at least 1 number" })
    .regex(/[A-Z]/, {
      error: "Password must contain at least 1 uppercase letter",
    }),
});

export type SignUpFormData = z.infer<typeof formSchema>;

export default function SignupForm({
  onHandleTabSwitch,
  plan,
  useOneTap = true,
}: {
  onHandleTabSwitch: (FormTabs: FormTabs) => void;
  plan?: PlanName;
  useOneTap?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const signUpUser = useAuthStore((s) => s.signup);
  const navigate = useNavigate();
  const googleLogin = useAuthStore((s) => s.googleLogin);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(data: SignUpFormData) {
    startTransition(async () => {
      try {
        await signUpUser({ ...data, plan });
        onHandleTabSwitch("form-otp");
      } catch (err) {
        const { message } = parseAxiosError(err);
        toast.error(message);
      }
    });
  }

  async function handleGoogleSuccess(
    credentialResponse: CredentialResponse,
  ): Promise<void> {
    if (!credentialResponse.credential) {
      toast.error("Google sign-in failed. No credential received.");
      return;
    }
    try {
      const { message } = await googleLogin(credentialResponse.credential);
      toast.success(message);
      navigate({ to: "/dashboard" });
    } catch (err) {
      const { message } = parseAxiosError(err);
      toast.error(message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fullname</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FieldGroup>
          <Button
            disabled={isPending}
            type="submit"
            size="lg"
            className="w-full"
          >
            {isPending ? "Signing up..." : "Signup"} <ChevronRight />
          </Button>

          <FieldSeparator>or</FieldSeparator>

          <GoogleLogin
            shape="pill"
            theme="outline"
            width={"100%"}
            size="large"
            text="continue_with"
            useOneTap={useOneTap}
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.error("Google login failed");
              toast.error("Google sign-in failed. Please try again.");
            }}
          />
        </FieldGroup>

        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{" "}
          <Button
            type="button"
            variant={"link"}
            className="text-foreground px-1"
            asChild
          >
            <Link to="/signin">Signin</Link>
          </Button>
        </p>
      </form>
    </Form>
  );
}
