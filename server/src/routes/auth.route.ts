import env from "@server/app/validate-env";
import { zUserSchema } from "@server/db/models/user.model";
import { zSignin } from "@server/db/z-schemas/user.schemas";
import { AuthError } from "@server/errors/auth.error";
import { tokenDecoder } from "@server/lib/decode-token";
import logger from "@server/lib/logger";
import { zValidator } from "@server/lib/zod-validator";
import { getServiceForRole } from "@server/services";
import cookieService from "@server/services/cookie.service";
import googleAuthService from "@server/services/google-auth.service";
import mailer from "@server/services/mailer.service";
import otpService from "@server/services/otp.service";
import tokenService from "@server/services/token.service";
import userService from "@server/services/user.service";
import { Hono } from "hono";
import { CONFLICT, CREATED, OK, UNAUTHORIZED } from "stoker/http-status-codes";
import z from "zod";

const zUserSignup = zUserSchema.omit({
  role: true,
  refreshToken: true,
  permissions: true,
});

const zGoogleAuth = z.object({
  idToken: z.string(),
});

const isDevMode = env.ENV !== "production";

const app = new Hono()
  .basePath("/auth")

  .post("/google", zValidator("json", zGoogleAuth), async (c) => {
    const { idToken } = c.req.valid("json");

    let profile;
    try {
      profile = await googleAuthService.verifyIdToken(idToken);
    } catch (error) {
      console.error("Google token verification failed:", error);
      throw new AuthError("Invalid Google authentication token.", UNAUTHORIZED);
    }

    const user = await userService.handleGoogleSignIn(profile);

    if (!user) {
      throw new AuthError("User creation failed after Google authentication.");
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

    console.info(`${updatedUser.fullname} logged in via Google`);

    return c.json(
      {
        success: true,
        message: "Google sign-in successful",
        data: {
          accessToken,
        },
      },
      OK
    );
  })

  .post("/signup", zValidator("json", zUserSignup), async (c) => {
    const incomingUser = c.req.valid("json");

    const userExists = await userService.exists(incomingUser.email, "email");

    if (userExists) {
      throw new AuthError("User with email already exists", CONFLICT);
    }

    const otpSecret = otpService.generateUserSecret();

    const user = await userService.create({ ...incomingUser, otpSecret });

    const otpToken = await tokenService.createOtpToken({
      id: user._id,
      role: user.role,
      twoFactorEnabled: user.twoFactorEnabled,
    });

    await cookieService.setOTPCookie(c, otpToken);

    const otpCode = await otpService.generateOtp(user.otpSecret);

    await mailer.sendMail({
      to: user.email,
      subject: "Welcome to TaskMint",
      template: "welcome",
      payload: { otp: otpCode, username: user.fullname },
    });

    console.info(`User ${user.fullname} has been registered`);

    return c.json(
      {
        message: "Signup successful",
        success: true,
        data: {
          otp: isDevMode && otpCode,
        },
      },
      CREATED
    );
  })

  .post("/signin", zValidator("json", zSignin()), async (c) => {
    const userCredentials = c.req.valid("json");

    const user = await userService.findByField("email", userCredentials.email);

    if (!user || !user?.password) throw new AuthError("Incorrect credentials");

    const isPasswordMatch = await user.comparePassword(
      userCredentials.password
    );

    if (!isPasswordMatch) throw new AuthError("Incorrect credentials");

    const twoFactorEnabled = user.twoFactorEnabled;

    if (twoFactorEnabled) {
      const otpToken = await tokenService.createOtpToken({
        id: user._id,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
      });

      await cookieService.setOTPCookie(c, otpToken);

      const otpCode = await otpService.generateOtp(user.otpSecret);

      await mailer.sendMail({
        to: user.email,
        subject: "Your TaskMint OTP",
        template: "otp",
        payload: { otp: otpCode },
      });

      console.info(`${user.fullname} needs to verify OTP`);

      return c.json(
        {
          success: true,
          message: "OTP required for signin",
          data: {
            otp: isDevMode && otpCode,
            twoFactorEnabled,
          },
        },
        OK
      );
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

    if (!updatedUser) {
      throw new AuthError("Failed to update refresh token");
    }

    await cookieService.setAuthCookies(c, { refreshToken, accessToken });

    console.info(`${updatedUser.fullname} logged in`);

    return c.json(
      {
        success: true,
        message: "Signin successful",
        data: {
          accessToken,
          twoFactorEnabled,
        },
      },
      OK
    );
  })

  .post("/logout", async (c) => {
    const refreshToken = await cookieService.getRefreshCookie(c);

    if (!refreshToken) {
      cookieService.deleteAuthCookies(c);
      logger.info(`A user logged out`);
      return c.json({ success: true, message: "Logout successful" });
    }

    const { role, id } = tokenDecoder(refreshToken);

    if (!role || !id) {
      logger.info(`A user logged out`);
      return c.json({ success: true, message: "Logout successful" });
    }

    const service = getServiceForRole(role);
    const user = await service.findByRefreshToken(id, refreshToken);

    if (user) {
      await service.removeRefreshToken(user._id, refreshToken);
    }

    return c.json({ success: true, message: "Logout successful" }, OK);
  });

export default app;
