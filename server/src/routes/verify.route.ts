import type { AppBindings } from "@server/app/create-app";
import { AuthError } from "@server/errors/auth.error";
import { zValidator } from "@server/lib/zod-validator";
import { authMiddleware } from "@server/middlewares/auth.middleware";
import otpService from "@server/services/otp.service";
import userService from "@server/services/user.service";
import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import z from "zod";

const zUserVerifyOtp = z.object({
  code: z.number(),
});

const app = new Hono<AppBindings>()
  .basePath("/verify")

  .use(authMiddleware)

  .post("/otp", zValidator("json", zUserVerifyOtp), async (c) => {
    const { code } = c.req.valid("json");
    const { id: userId } = c.get("user");

    const user = await userService.findById(userId);

    if (!user) {
      throw new AuthError("User not found");
    }

    const isValid = await otpService.verifyOtp(code, user.otpSecret);

    if (!isValid) throw new AuthError("Invalid OTP");

    return c.json({
      success: true,
      message: "OTP verification successful",
    });
  })

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

  .get("resend-otp", async (c) => {
    const { id: userId } = c.get("user");

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
