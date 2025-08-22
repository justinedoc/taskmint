import type { mUser, User } from "@server/db/models/user.model";
import UserModel from "@server/db/models/user.model";
import { BaseUserService } from "@server/services/base-user.service";
import type { Model } from "mongoose";

class UserService extends BaseUserService<mUser> {
  constructor(userModel: Model<mUser>) {
    super(userModel);
  }

  profile(user: User) {
    const { _id, fullname, email, role, username, profileImg } = user;
    return { id: _id, fullname, email, role, username, profileImg };
  }
}

const userService = new UserService(UserModel);

export default userService;
