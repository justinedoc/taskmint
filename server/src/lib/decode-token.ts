import type { Role } from "@server/db/schemas";
import type { TokenPayload } from "@server/services/token.service";
import { decode } from "hono/jwt";

export function tokenDecoder(token: string) {
  const decoded = decode(token).payload as TokenPayload;

  const role = decoded.role as Role;

  return { id: decoded.id, role };
}
