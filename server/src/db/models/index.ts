import type { mAdmin } from "@server/db/models/admin.model";
import type { mUser } from "@server/db/models/user.model";
import type { Model } from "mongoose";

export type AllModels = Model<mUser> | Model<mAdmin>;
