import { API } from "@/api/axios";
import { ForgotPasswordFormData } from "@/components/auth/forgot-password-form";
import { ResetPasswordFormData } from "@/components/auth/reset-password-form";
import { SignInFormData } from "@/components/auth/signin-form";
import { SignUpFormData } from "@/components/auth/signup-form";
import { PlanName } from "@/constants/pricing";
import { sleep } from "@/lib/sleep";
import { ApiResponse } from "@/types";

//  USER SIGNUP
export async function signUpUser(
  data: SignUpFormData & { plan?: PlanName },
): Promise<ApiResponse<{ accessToken: string }>> {
  const res = await API.post(
    "/auth/signup",
    { ...data, fullname: data.name },
    { skipAuthRefresh: true },
  );

  console.log("User signup data: ", res.data);
  return res.data;
}

/* USER SIGN IN */
export async function signInUser(
  data: SignInFormData,
): Promise<ApiResponse<{ accessToken: string }>> {
  const res = await API.post("/auth/signin", data, { skipAuthRefresh: true });

  console.log("User signin data: ", res.data);
  return res.data;
}

export async function signOutUser() {
  await API.post("/auth/logout");
}

export async function verifyOTP(code: number): Promise<ApiResponse<undefined>> {
  const res = await API.post(
    "/verify/otp",
    { code },
    { skipAuthRefresh: true },
  );
  return res.data;
}

export async function resendOTP(): Promise<ApiResponse<undefined>> {
  const res = await API.get("/verify/otp-resend", {
    skipAuthRefresh: true,
  });
  return res.data;
}

//  USER FORGOT PASSWORD
export async function forgotPassword(data: ForgotPasswordFormData) {
  await sleep(2000);
  console.log("forgot password data", data);
  return {
    success: true,
    message: "Password reset link sent successfully",
  };
}

export async function resetPassword(
  data: Pick<ResetPasswordFormData, "password"> & { token: string },
) {
  await sleep(2000);
  console.log("reset password data", data);
  return {
    success: true,
    message: "Password reset was successful",
  };
}
