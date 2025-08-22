import type { AppBindings } from "@server/app/create-app";
import { Permission } from "@server/lib/permissions";
import { authMiddleware } from "@server/middlewares/auth.middleware";
import { requirePermission } from "@server/middlewares/require-permission.middleware";
import userService from "@server/services/user.service";
import { Hono } from "hono";
import { BAD_REQUEST, OK } from "stoker/http-status-codes";

const app = new Hono<AppBindings>()
  .basePath("/user")

  .use(authMiddleware)

  .get("/current", requirePermission(Permission.SELF_READ), async (c) => {
    const currentUser = c.get("user");

    const user = await userService.findById(currentUser.id);

    if (!user) {
      return c.json(
        { success: false, message: "User not found " },
        BAD_REQUEST
      );
    }

    return c.json(
      {
        success: true,
        message: "successful",
        data: userService.profile(user),
      },
      OK
    );
  });

export default app;
