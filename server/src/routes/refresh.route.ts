import { AuthError } from "@server/errors/auth.error";
import { tokenDecoder } from "@server/lib/decode-token";
import { getServiceForRole } from "@server/services";
import { AuthService } from "@server/services/auth.service";
import cookieService from "@server/services/cookie.service";
import { Hono } from "hono";
import { UNAUTHORIZED } from "stoker/http-status-codes";

const app = new Hono()
  .basePath("/refresh")

  .post("/", async (c) => {
    const refreshToken = await cookieService.getRefreshCookie(c);

    if (!refreshToken) {
      throw new AuthError("Session expired please login again", UNAUTHORIZED);
    }

    const { role } = tokenDecoder(refreshToken);

    if (!role) {
      throw new AuthError("Invalid refresh token", UNAUTHORIZED);
    }

    const userService = getServiceForRole(role);
    const authService = new AuthService(userService);

    const { accessToken, refreshToken: newRefreshToken } =
      await authService.refreshAuth(refreshToken);

    await cookieService.setAuthCookies(c, {
      accessToken,
      refreshToken: newRefreshToken,
    });

    return c.json({ success: true, message: "Tokens refreshed", accessToken });
  });

export default app;
