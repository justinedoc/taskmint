import { OpenAPIHono } from "@hono/zod-openapi";
import connectDb from "@server/db";
import { onError } from "@server/middlewares/on-error";
import { rateLimiter } from "hono-rate-limiter";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";

export function createRouter() {
  return new OpenAPIHono({
    strict: false,
    defaultHook,
  });
}

export async function createApp() {
  await connectDb();
  const app = createRouter();

  app.use(serveEmojiFavicon("🎉"));

  app.use(
    rateLimiter({
      windowMs: 15 * 60 * 1000,
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
      origin: ["http://localhost:5173"],
      credentials: true,
    })
  );
  app.use(compress());
  app.use(secureHeaders());
  app.use(prettyJSON());
  app.use(logger());

  app.onError(onError);
}
