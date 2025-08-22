import { AuthError } from "@server/errors/auth.error";
import logger from "@server/lib/logger";
import cookieService from "@server/services/cookie.service";
import tokenService from "@server/services/token.service";
import type { Context, Next } from "hono";
import { JwtTokenExpired } from "hono/utils/jwt/types";
import { model } from "mongoose";
import { FORBIDDEN, UNAUTHORIZED } from "stoker/http-status-codes";

export async function authMiddleware(c: Context, next: Next) {
  const accessToken = await cookieService.getAccessCookie(c);

  if (!accessToken) {
    throw new AuthError("Missing access token", UNAUTHORIZED, "NO_TOKEN");
  }

  try {
    const decoded = await tokenService.verifyAccessToken(accessToken);

    console.log(decoded);

    if (!decoded) {
      throw new AuthError(
        "Invalid access token",
        UNAUTHORIZED,
        "INVALID_TOKEN"
      );
    }

    try {
      const exists = await model(decoded.role).exists({ _id: decoded.id });

      if (!exists) {
        throw new AuthError(
          "Access denied: user not found",
          FORBIDDEN,
          "USER_NOT_FOUND"
        );
      }
    } catch (err) {
      if (err instanceof AuthError) throw err;
      throw new Error("User not found");
    }

    c.set("user", decoded);
    logger.info(`User ${decoded.id} authenticated as ${decoded.role}`);
    await next();
  } catch (err) {
    if (err instanceof JwtTokenExpired) {
      logger.warn("Access token expired");
      return c.json(
        {
          success: false,
          message: "Access token has expired",
          code: "TOKEN_EXPIRED",
        },
        UNAUTHORIZED
      );
    }
    throw err;
  }
}
