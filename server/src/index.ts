import { serve } from "@hono/node-server";
import app from "@server/app";
import env from "@server/app/validate-env";
import logger from "@server/lib/logger";

const serverConfig = {
  fetch: app.fetch,
  port: env.PORT,
};

serve(serverConfig, (info) => {
  logger.info(`✅ Server is running on http://localhost:${info.port}`);
});
