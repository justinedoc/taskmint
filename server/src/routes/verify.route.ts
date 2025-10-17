import type { AppBindings } from "@server/app/create-app";
import { AuthError } from "@server/errors/auth.error";
import { zValidator } from "@server/lib/zod-validator";
import { otpMiddleware } from "@server/middlewares/otp.middleware";
import cookieService from "@server/services/cookie.service";
import otpService from "@server/services/otp.service";
import tokenService from "@server/services/token.service";
import userService from "@server/services/user.service";
import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { FORBIDDEN, OK, UNAUTHORIZED } from "stoker/http-status-codes";
import z from "zod";

const zUserVerifyOtp = z.object({
  code: z.number(),
});

const app = new Hono<AppBindings>()

  .post(
    "/verify-otp",
    otpMiddleware,
    zValidator("json", zUserVerifyOtp),
    async (c) => {
      const { code } = c.req.valid("json");

      const otpToken = await cookieService.getOtpCookie(c);

      if (!otpToken) {
        throw new AuthError(
          "Session expired or missing. Please sign in again.",
          UNAUTHORIZED
        );
      }

      const decodedToken = await tokenService.verifyOtpToken(otpToken);

      const user = await userService.findById(decodedToken.id);

      if (!user) {
        throw new AuthError("User not found.", FORBIDDEN);
      }

      const isOtpValid = otpService.verifyOtp(code, user.otpSecret);

      if (!isOtpValid) {
        throw new AuthError("Invalid OTP code", UNAUTHORIZED);
      }

      const { accessToken, refreshToken } = await tokenService.createTokenPair({
        id: user._id,
        role: user.role,
        permissions: user.permissions,
        twoFactorEnabled: user.twoFactorEnabled,
      });

      const updatedUser = await userService.addRefreshToken(
        user._id,
        refreshToken
      );
      if (!updatedUser) throw new AuthError("Failed to update refresh token");

      await cookieService.setAuthCookies(c, { refreshToken, accessToken });
      cookieService.deleteOtpCookie(c);

      return c.json(
        {
          success: true,
          message: "OTP verification successful. Welcome!",
          data: { accessToken },
        },
        OK
      );
    }
  )

  .use(
    rateLimiter({
      windowMs: 15 * 60 * 1000,
      limit: 3,
      keyGenerator: (c) =>
        c.req.header("CF-Connecting-IP") ||
        c.req.header("X-Forwarded-For") ||
        "unknown",

      handler: (c, _, options) => {
        c.status(429);
        c.header("Retry-After", Math.ceil(options.windowMs / 1000).toString());
        return c.json({
          success: false,
          message: "Too many requests. Please try again later.",
        });
      },
    })
  )

  .get("resend-otp", otpMiddleware, async (c) => {
    const { id: userId } = c.get("unverifiedUser");

    const user = await userService.findById(userId);

    if (!user) throw new AuthError("You cannot perform this action!");

    const code = await otpService.generateOtp(user.otpSecret);

    return c.json({
      success: true,
      message: "OTP resent successfully",
      data: { code },
    });
  });

export default app;
