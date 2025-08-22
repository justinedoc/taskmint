import { zUserSchema } from "@server/db/models/user.model";
import { AuthError } from "@server/errors/auth.error";
import { zValidator } from "@server/lib/zod-validator";
import { CookieService } from "@server/services/cookie.service";
import tokenService from "@server/services/token.service";
import userService from "@server/services/user.service";
import { Hono } from "hono";
import { CONFLICT } from "stoker/http-status-codes";

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
      ...user,
      id: user._id,
    });

    const updatedUser = await userService.addRefreshToken(
      user._id,
      refreshToken
    );

    if (!updatedUser) throw new AuthError("Failed to update refresh token");

    CookieService.setAuthCookies(c, { accessToken, refreshToken });

    return c.json({
      message: "Signup successful",
      success: true,
      data: userService.profile(user),
    });
  });

export default app;
