import { AuthError } from "@server/errors/auth.error";
import cookieService from "@server/services/cookie.service";
import tokenService from "@server/services/token.service";
import type { Context, Next } from "hono";
import { UNAUTHORIZED } from "stoker/http-status-codes";

export async function otpMiddleware(c: Context, next: Next) {
  const otpToken = await cookieService.getOtpCookie(c);

  console.log(otpToken)

  if (!otpToken) {
    throw new AuthError(
      "Authentication required: No temporary session token found.",
      UNAUTHORIZED,
      "NO_OTP_TOKEN"
    );
  }

  try {
    const decoded = await tokenService.verifyOtpToken(otpToken);
    c.set("unverifiedUser", decoded);
    await next();
  } catch (err) {
    throw new AuthError(
      "Temporary session token is invalid or expired. Please sign in again.",
      UNAUTHORIZED,
      "OTP_TOKEN_INVALID"
    );
  }
}
