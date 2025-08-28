import { AuthError } from "@server/errors/auth.error";
import logger from "@server/lib/logger";
import tokenService from "@server/services/token.service";
import type { Context, Next } from "hono";
import { JwtTokenExpired } from "hono/utils/jwt/types";
import { model } from "mongoose";
import { FORBIDDEN, UNAUTHORIZED } from "stoker/http-status-codes";

export async function authMiddleware(c: Context, next: Next) {
  const accessToken = c.req.header("Authorization")?.split(" ")[1];

  if (!accessToken) {
    throw new AuthError("Missing access token", UNAUTHORIZED, "NO_TOKEN");
  }

  try {
    const decoded = await tokenService.verifyAccessToken(accessToken);

    const exists = await model(decoded.role).exists({ _id: decoded.id });

    if (!exists) {
      throw new AuthError(
        "Access denied: user not found",
        FORBIDDEN,
        "USER_NOT_FOUND"
      );
    }

    c.set("user", decoded);
    console.info(`User ${decoded.id} authenticated as ${decoded.role}`);
    await next();
  } catch (err) {
    if (err instanceof AuthError) {
      throw err;
    }

    if (err instanceof JwtTokenExpired) {
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
