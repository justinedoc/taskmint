import type { AppBindings } from "@server/app/create-app";
import cloudinary from "@server/config/cloudinary";
import UserModel from "@server/db/models/user.model";
import { zGetById, zUpdateUserData } from "@server/db/z-schemas/user.schemas";
import { MAX_IMG_SIZE, zImage } from "@server/lib/img-validator";
import { enforcePermission, Permission } from "@server/lib/permissions";
import { zValidator } from "@server/lib/zod-validator";
import { authMiddleware } from "@server/middlewares/auth.middleware";
import { requirePermission } from "@server/middlewares/require-permission.middleware";
import { CloudinaryService } from "@server/services/cloudinary.service";
import cookieService from "@server/services/cookie.service";
import userService from "@server/services/user.service";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  OK,
} from "stoker/http-status-codes";
import z from "zod";

const profileImageSchema = z.object({
  profileImg: zImage,
});

const app = new Hono<AppBindings>()
  .basePath("/user")

  .use(authMiddleware)

  /* GETS THE CURRENT USER */
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

  /* UPLOADS USER PROFILE PICTURE */
  .post(
    "/profile-picture",
    bodyLimit({
      maxSize: MAX_IMG_SIZE,
      onError: (c) => {
        return c.json(
          {
            success: false,
            message: `File size limit of ${MAX_IMG_SIZE / 1024 / 1024}MB exceeded.`,
          },
          BAD_REQUEST
        );
      },
    }),
    zValidator("form", profileImageSchema),
    async (c) => {
      const { profileImg } = c.req.valid("form");
      const { id: userId } = c.get("user");

      const imageBuffer = Buffer.from(await profileImg.arrayBuffer());
      const dataURI = `data:${profileImg.type};base64,${imageBuffer.toString("base64")}`;

      const uploadResult = await CloudinaryService.uploadWithBase64(dataURI, {
        folder: "profile_pictures",
        public_id: userId,
      });

      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { profileImg: uploadResult.secure_url },
        { new: true }
      ).select("profileImg");

      if (!updatedUser) {
        return c.json(
          { success: false, message: "User not found." },
          NOT_FOUND
        );
      }

      return c.json(
        {
          success: true,
          message: "Profile picture updated successfully.",
          data: {
            profileImg: updatedUser.profileImg,
          },
        },
        OK
      );
    }
  )

  /* DELETES USER PROFILE PICTURE */
  .delete("/profile-picture", async (c) => {
    const { id: userId } = c.get("user");
    const publicId = `profile_pictures/${userId}`;

    const deletionResult = await cloudinary.uploader.destroy(publicId);

    if (deletionResult.result !== "ok") {
      console.warn("Cloudinary deletion may have failed for:", publicId);
    }

    await UserModel.findByIdAndUpdate(userId, { $unset: { profileImg: "" } });

    return c.json(
      { success: true, message: "Profile picture removed successfully." },
      OK
    );
  })

  /* TOGGLE USER 2FA */
  .post("/toggle-2fa", requirePermission(Permission.SELF_UPDATE), async (c) => {
    const { id: userId } = c.get("user");

    const user = await userService.findById(userId);

    if (!user) {
      return c.json({ success: false, message: "User not found." }, NOT_FOUND);
    }

    if (!user.password) {
      return c.json(
        {
          success: false,
          message: "2FA cannot be toggled for accounts without a password.",
        },
        BAD_REQUEST
      );
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { twoFactorEnabled: !user.twoFactorEnabled },
      { new: true, runValidators: true }
    ).select("twoFactorEnabled");

    if (!updatedUser) {
      return c.json(
        { success: false, message: "Failed to update 2FA setting." },
        NOT_FOUND
      );
    }

    const newStatus = updatedUser.twoFactorEnabled ? "enabled" : "disabled";
    return c.json(
      {
        success: true,
        message: `Two-factor authentication has been ${newStatus}.`,
        data: { twoFactorEnabled: updatedUser.twoFactorEnabled },
      },
      OK
    );
  })

  /* UPDATES THE CURRENT USER */
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

  /* DELETES THE CURRENT USER */
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
