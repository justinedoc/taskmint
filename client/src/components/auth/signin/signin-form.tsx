import { FormTabs } from "@/components/auth/signin/signin-tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInUser } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Eye, EyeOff } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
});

export type SignInFormData = z.infer<typeof formSchema>;

export default function SigninForm({
  onHandleTabSwitch,
}: {
  onHandleTabSwitch: (FormTabs: FormTabs) => void;
}) {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { mutate } = useMutation({
    mutationFn: signInUser,
    onError(error) {
      toast.error(error.message);
    },
  });

  const form = useForm<SignInFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  function onSubmit(data: SignInFormData) {
    startTransition(async () => {
      mutate(data);
    });

    onHandleTabSwitch("form-otp");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="youremail@example.com" {...field} />
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
              <div className="relative">
                <FormControl>
                  <Input
                    type={isPasswordHidden ? "password" : "text"}
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>

                <span
                  className="absolute top-[48%] right-2 -translate-y-1/2 cursor-pointer text-sm"
                  onClick={() => setIsPasswordHidden((cur) => !cur)}
                >
                  {isPasswordHidden ? <Eye /> : <EyeOff />}
                </span>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="-mt-4 flex items-center justify-between text-sm">
          <Button
            type="button"
            variant="link"
            className="text-muted-foreground"
          >
            <Link to="/forgot-password">Forgot password?</Link>
          </Button>

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row-reverse items-center">
                <FormLabel>Remember me</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button disabled={isPending} type="submit" size="lg" className="w-full">
          Sign in <ChevronRight />
        </Button>
        <p className="text-muted-foreground text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup">
            <Button
              type="button"
              variant={"link"}
              className="text-foreground px-1"
            >
              Signup
            </Button>
          </Link>
        </p>
      </form>
    </Form>
  );
}
