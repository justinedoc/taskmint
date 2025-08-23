import { zUserSchema } from "@server/db/models/user.model";
import { zSignin } from "@server/db/schemas";
import { AuthError } from "@server/errors/auth.error";
import { tokenDecoder } from "@server/lib/decode-token";
import logger from "@server/lib/logger";
import { zValidator } from "@server/lib/zod-validator";
import { getServiceForRole } from "@server/services";
import cookieService from "@server/services/cookie.service";
import tokenService from "@server/services/token.service";
import userService from "@server/services/user.service";
import { Hono } from "hono";
import { CONFLICT, CREATED, OK } from "stoker/http-status-codes";

const zUserSignup = zUserSchema.omit({
  role: true,
  refreshToken: true,
  permissions: true,
});

const app = new Hono()
  .basePath("/auth")

  .post("/signup", zValidator("json", zUserSignup), async (c) => {
    const incomingUser = c.req.valid("json");

    const userExists = await userService.exists(incomingUser.email, "email");

    if (userExists) {
      throw new AuthError("User with email already exists", CONFLICT);
    }

    const user = await userService.create(incomingUser);

    const { accessToken, refreshToken } = await tokenService.createTokenPair({
      id: user._id,
      role: user.role,
      permissions: user.permissions,
    });

    const updatedUser = await userService.addRefreshToken(
      user._id,
      refreshToken
    );

    if (!updatedUser) throw new AuthError("Failed to update refresh token");

    await cookieService.setAuthCookies(c, { accessToken, refreshToken });

    console.info(`User ${user.fullname} has been registered`);

    return c.json(
      {
        message: "Signup successful",
        success: true,
        data: { accessToken },
      },
      CREATED
    );
  })

  .post("/signin", zValidator("json", zSignin()), async (c) => {
    const userCredentials = c.req.valid("json");

    const user = await userService.findByField("email", userCredentials.email);

    if (!user) throw new AuthError("Incorrect credentials");

    const isPasswordMatch = await user.comparePassword(
      userCredentials.password
    );

    if (!isPasswordMatch) throw new AuthError("Incorrect credentials");

    const { accessToken, refreshToken } = await tokenService.createTokenPair({
      id: user._id,
      role: user.role,
      permissions: user.permissions,
    });

    const updatedUser = await userService.addRefreshToken(
      user._id,
      refreshToken
    );

    if (!updatedUser) throw new AuthError("Failed to update refresh token");

    await cookieService.setAuthCookies(c, { refreshToken, accessToken });

    console.info(`${user.fullname} logged in`);

    return c.json(
      {
        success: true,
        message: "Signin successful",
        data: { accessToken },
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
