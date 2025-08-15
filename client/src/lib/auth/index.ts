import { ForgotPasswordFormData } from "@/components/auth/forgot-password/forgot-password-form";
import { SignInFormData } from "@/components/auth/signin/signin-form";
import { sleep } from "@/lib/sleep";

/* USER SIGN IN */
export async function signInUser(data: SignInFormData) {
  console.log("Sign in data", data);
  await sleep(2000);
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
  console.log("Sign up data", data);
  await sleep(2000);
}

//  USER FORGOT PASSWORD
export async function forgotPassword(data: ForgotPasswordFormData) {
  console.log("forgot password data", data);
  await sleep(2000);
}
