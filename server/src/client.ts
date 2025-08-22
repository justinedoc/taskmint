import type { AppType } from "@server/app";
import { hc } from "hono/client";

export type Client = ReturnType<typeof hc<AppType>>;

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<AppType>(...args);
