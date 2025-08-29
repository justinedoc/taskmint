import { resendOTP, verifyOTP } from "@/api/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { parseAxiosError } from "@/lib/parse-axios-error";
import { useAuthStore } from "@/store/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const OTPFormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

type TOTPForm = z.infer<typeof OTPFormSchema>;

export default function FormOTP({ navigateTo = "/dashboard" }) {
  const [resendCooldown, setResendCooldown] = useState(0);
  const markVerified = useAuthStore((state) => state.markVerified);
  const navigate = useNavigate();

  const { mutate: tVerifyOTP, isPending: isVerifying } = useMutation({
    mutationFn: verifyOTP,
    onSuccess: async (data) => {
      await markVerified();
      toast.success(data.message);
      navigate({
        to: navigateTo,
      });
    },

    onError(err) {
      const { message } = parseAxiosError(err);
      toast.error(message);
    },
  });

  const { mutate: tResendOTP, isPending: isResending } = useMutation({
    mutationFn: resendOTP,
    onError(err) {
      const { message } = parseAxiosError(err);
      toast.error(message);
    },
    onSuccess: async (data) => {
      toast.success(data.message);

      const expiresAt = Date.now() + 30_000;
      localStorage.setItem("otp_cooldown_expires_at", expiresAt.toString());
      setResendCooldown(30);
    },
  });

  const OTPForm = useForm<TOTPForm>({
    resolver: zodResolver(OTPFormSchema),
    defaultValues: {
      pin: "",
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem("otp_cooldown_expires_at");
    if (saved) {
      const expiresAt = Number(saved);
      const now = Date.now();
      const remaining = Math.ceil((expiresAt - now) / 1000);

      if (remaining > 0) {
        setResendCooldown(remaining);
      }
    }
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          localStorage.removeItem("otp_cooldown_expires_at");
          clearInterval(timer);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  function onSubmitOTP(data: TOTPForm) {
    tVerifyOTP(Number(data.pin));
  }

  function handleResendOTP() {
    if (resendCooldown > 0) return;
    tResendOTP();
  }

  return (
    <Form {...OTPForm}>
      <form onSubmit={OTPForm.handleSubmit(onSubmitOTP)} className="space-y-6">
        <FormField
          control={OTPForm.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP pattern={REGEXP_ONLY_DIGITS} maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your email.
              </FormDescription>
              <FormDescription>
                Didn't receive it?{" "}
                <Button
                  variant={"link"}
                  type="button"
                  disabled={isResending || resendCooldown > 0}
                  onClick={handleResendOTP}
                  className="text-foreground disabled:text-foreground/50 px-1 font-medium underline disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0
                    ? `resend in ${resendCooldown}s`
                    : isResending
                      ? "resending..."
                      : "resend OTP"}
                </Button>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size={"lg"}
          className="w-full rounded-full"
          disabled={isVerifying}
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </Button>
      </form>
    </Form>
  );
}
