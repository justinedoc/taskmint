import { compress } from "@hono/bun-compress";
import { OpenAPIHono } from "@hono/zod-openapi";
import connectDb from "@server/config/mongodb";
import { onError } from "@server/middlewares/on-error.middleware";
import type { TokenPayload } from "@server/services/token.service";
import { rateLimiter } from "hono-rate-limiter";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";
import { APP_ORIGINS } from "../config/app-origins";

export type AppBindings = {
  Variables: {
    user: TokenPayload;
    unverifiedUser: TokenPayload;
  };
};

export function createRouter() {
  return new OpenAPIHono({
    strict: false,
    defaultHook,
  }).basePath("/api");
}

export async function createApp(_Hono: any) {
  await connectDb();
  const app = createRouter();

  app.use(serveEmojiFavicon("🔥"));

  app.use(
    rateLimiter({
      windowMs: 15 * 60 * 1000,
      limit: 1000,
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
  );

  app.use(
    cors({
      origin: APP_ORIGINS,
      credentials: true,
    })
  );
  app.use(compress());
  app.use(secureHeaders());
  app.use(prettyJSON());
  app.use(logger());

  app.onError(onError);

  return app;
}
