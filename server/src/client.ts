import { hc } from "hono/client";
import { type AppType } from "@server/index";

export type Client = ReturnType<typeof hc<AppType>>;

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<AppType>(...args);
