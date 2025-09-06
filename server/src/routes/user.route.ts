import type { AppBindings } from "@server/app/create-app";
import { zGetById, zUpdateUserData } from "@server/db/schemas";
import { enforcePermission, Permission } from "@server/lib/permissions";
import { zValidator } from "@server/lib/zod-validator";
import { authMiddleware } from "@server/middlewares/auth.middleware";
import { requirePermission } from "@server/middlewares/require-permission.middleware";
import cookieService from "@server/services/cookie.service";
import userService from "@server/services/user.service";
import { Hono } from "hono";
import { BAD_REQUEST, FORBIDDEN, OK } from "stoker/http-status-codes";
import z from "zod";

const app = new Hono<AppBindings>()
  .basePath("/user")

  .use(authMiddleware)

  // get the current user
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
  })

  // update user profile image
  .patch(
    "/profile-picture",
    zValidator("form", z.object({ profileImg: z.string() })),
    async () => {}
  )

  // update user information
  .patch(
    "/:id",
    zValidator("param", zUpdateUserData().zId),
    zValidator("json", zUpdateUserData().zData),
    requirePermission(Permission.SELF_UPDATE),
    async (c) => {
      const targetUserId = c.req.valid("param");
      const data = c.req.valid("json");
      const currentUser = c.get("user");

      if (targetUserId.id !== currentUser.id) {
        return c.json(
          { success: false, message: "You can not perform this action!" },
          FORBIDDEN
        );
      }

      const user = await userService.update(targetUserId.id, data);

      if (!user) {
        return c.json(
          {
            success: false,
            message:
              "An error occured while trying to update your profile, please try again later",
          },
          BAD_REQUEST
        );
      }

      return c.json(
        {
          success: true,
          message: "User updated successfully",
          data: { user: userService.profile(user) },
        },
        OK
      );
    }
  )

  // delete user
  .delete(
    "/:id",
    zValidator("param", zGetById()),
    requirePermission(Permission.SELF_DELETE, Permission.USER_DELETE),
    async (c) => {
      const { id: targetUserId } = c.req.valid("param");
      const currentUser = c.get("user");

      enforcePermission(
        currentUser,
        targetUserId,
        Permission.SELF_DELETE,
        Permission.USER_DELETE
      );

      await userService.delete(targetUserId);

      cookieService.deleteAuthCookies(c);

      return c.json(
        { success: false, message: "Account deleted successfully" },
        OK
      );
    }
  );

export default app;
