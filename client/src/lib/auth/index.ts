import { ForgotPasswordFormData } from "@/components/auth/forgot-password/forgot-password-form";
import { SignInFormData } from "@/components/auth/signin/signin-form";
import { sleep } from "@/lib/sleep";

/* USER SIGN IN */
export async function signInUser(data: SignInFormData) {
  await sleep(2000);

  console.log("Sign in data", data);

  return {
    success: true,
    message: "Signin successful",
  };
}

export async function verifyOTP(pin: number) {
  //TODO: OTP verification logic here

  await sleep();

  console.log("opt pin: ", pin);

  return {
    success: true,
    message: "OTP verification successful",
  };
}

let RETRY_ATTEMPTS = 3;

export async function resendOTP() {
  //TODO: OTP resend logic here

  if (RETRY_ATTEMPTS <= 0) throw new Error("Retry attempts limit reached");

  await sleep();
  RETRY_ATTEMPTS -= 1;

  console.log("Resending otp...");

  return {
    success: true,
    message: "OTP resent successfully.",
  };
}

//  USER SIGNUP
export async function signUpUser(data: SignInFormData) {
  await sleep(2000);
  console.log("Sign up data", data);
  return {
    success: true,
    message: "Signup successful",
  };
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
