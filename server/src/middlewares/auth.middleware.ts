import { AuthError } from "@server/errors/auth.error";
import logger from "@server/lib/logger";
import cookieService from "@server/services/cookie.service";
import tokenService from "@server/services/token.service";
import type { Context, Next } from "hono";
import { JwtTokenExpired } from "hono/utils/jwt/types";
import { model } from "mongoose";
import { FORBIDDEN, UNAUTHORIZED } from "stoker/http-status-codes";

export async function authMiddleware(c: Context, next: Next) {
  const accessTokenFromHeader = c.req.header("Authorization");
  const accessTokenFromCookie = await cookieService.getAccessCookie(c);

  if (!accessTokenFromHeader && !accessTokenFromCookie) {
    throw new AuthError("Missing access token", UNAUTHORIZED, "NO_TOKEN");
  }

  const accessToken = accessTokenFromHeader
    ? accessTokenFromHeader.split(" ")[1]
    : accessTokenFromCookie;

  try {
    const decoded = await tokenService.verifyAccessToken(
      accessToken?.toString()!
    );

    const exists = await model(decoded.role).exists({ _id: decoded.id });

    if (!exists) {
      throw new AuthError(
        "Access denied: user not found",
        FORBIDDEN,
        "USER_NOT_FOUND"
      );
    }

    c.set("user", decoded);
    logger.info(`User ${decoded.id} authenticated as ${decoded.role}`);
    await next();
  } catch (err) {
    if (err instanceof AuthError) {
      throw err;
    }

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

    logger.error("An unexpected error occurred during authentication");
    throw err;
  }
}
