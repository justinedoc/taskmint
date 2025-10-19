import type { mUser, User } from "@server/db/models/user.model";
import UserModel from "@server/db/models/user.model";
import type { Role } from "@server/db/z-schemas/user.schemas";
import { AuthError } from "@server/errors/auth.error";
import { BaseUserService } from "@server/services/base-user.service";
import type { GoogleUserProfile } from "@server/services/google-auth.service";
import otpService from "@server/services/otp.service";
import type { Model } from "mongoose";

export class UserService extends BaseUserService<mUser> {
  constructor(userModel: Model<mUser>) {
    super(userModel);
  }

  profile(user: User) {
    const {
      _id,
      fullname,
      email,
      role,
      username,
      profileImg,
      twoFactorEnabled,
    } = user;
    return {
      id: _id,
      fullname,
      email,
      role,
      username,
      profileImg,
      twoFactorEnabled,
    };
  }

  private async generateUniqueUsername(email: string): Promise<string> {
    const base = email.split("@")[0] ?? "user";
    let candidate = base;
    let count = 1;
    while (await UserModel.exists({ username: candidate })) {
      candidate = `${base}${count++}`;
    }
    return candidate;
  }

  public async handleGoogleSignIn(profile: GoogleUserProfile): Promise<User> {
    const { id: googleId, email, name, picture } = profile;

    const existingLocalUser = await UserModel.findOne({ email });

    if (existingLocalUser) {
      if (existingLocalUser.password) {
        throw new AuthError(
          "Email already registered with a password. Please sign in first."
        );
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        existingLocalUser._id,
        {
          googleId: googleId,
          isVerified: true,
          twoFactorEnabled: false,
          fullname: existingLocalUser.fullname || name,
          profileImg: existingLocalUser.profileImg || picture,
        },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("Failed to link Google account to existing user.");
      }
      return updatedUser;
    }

    const user = await UserModel.findOneAndUpdate(
      { googleId },
      {
        $setOnInsert: {
          fullname: name,
          email: email,
          role: "User" as Role,
          isVerified: true,
          twoFactorEnabled: false,
          profileImg: picture,
          otpSecret: otpService.generateUserSecret(),
          username: await this.generateUniqueUsername(email),
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return user;
  }
}

const userService = new UserService(UserModel);
export default userService;
