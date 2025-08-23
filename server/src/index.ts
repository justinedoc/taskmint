import { createApp } from "@server/app/create-app";
import authRoutes from "@server/routes/auth.route";
import refreshRoute from "@server/routes/refresh.route";
import userRoutes from "@server/routes/user.route";
import { NOT_FOUND, OK } from "stoker/http-status-codes";

import "dotenv/config";

const app = await createApp();

app.get("/", (c) => {
  return c.json({ success: true, message: "Welcome to TaskMint API!" }, OK);
});

app.get("/health", (c) => {
  return c.json(
    {
      status: "OK",
      uptime: process.uptime(),
      env: process.env.NODE_ENV,
      pid: process.pid,
      message: "Server is up and running! 🔥",
    },
    OK
  );
});

app.doc("/doc", {
  openapi: "3.0.0",
  info: { title: "API Documentation", version: "1.0.0" },
});

app.route("/v1", authRoutes);
app.route("/v1", userRoutes);
app.route("/v1", refreshRoute);

app.notFound((c) => {
  return c.json({ message: `Route not found - ${c.req.path}` }, NOT_FOUND);
});

export type AppType = typeof app;

export default app;
