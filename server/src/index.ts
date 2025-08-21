import { Hono } from "hono";
import type { ApiResponse } from "shared/dist";

export const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/hello", async (c) => {
  const data: ApiResponse = {
    message: "Hello BHVR!, my friend",
    success: true,
  };

  return c.json(data, { status: 200 });
});

export default app;
