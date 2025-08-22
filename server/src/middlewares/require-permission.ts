
import { AuthError } from "@server/errors/auth.error";
import { Permission, hasPermission } from "@server/lib/permissions";
import type { Context, Next } from "hono";
import { FORBIDDEN } from "stoker/http-status-codes";

export function requirePermission(...requiredPermissions: Permission[]) {
  return async (c: Context, next: Next) => {
    const { role, permissions } = c.get("user") as Token;

    if (!hasPermission({ role, permissions }, requiredPermissions)) {
      throw new AuthError(
        "Insufficient permission to access this resource",
        FORBIDDEN
      );
    }

    return next();
  };
}