import type { mAdmin } from "@server/db/models/admin.model";
import UserModel from "@server/db/models/user.model";
import { BaseUserService } from "@server/services/base-user.service";
import type { Model } from "mongoose";

export class AdminService extends BaseUserService<mAdmin> {
  constructor(adminModel: Model<mAdmin>) {
    super(adminModel);
  }

  //TODO: some admin specific stuffs
}

const adminService = new AdminService(UserModel);

export default adminService;
