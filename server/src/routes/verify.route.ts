import type { AppBindings } from "@server/app/create-app";
import { AuthError } from "@server/errors/auth.error";
import { zValidator } from "@server/lib/zod-validator";
import { authMiddleware } from "@server/middlewares/auth.middleware";
import otpService from "@server/services/otp.service";
import userService from "@server/services/user.service";
import { Hono } from "hono";
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
  });

export default app;
