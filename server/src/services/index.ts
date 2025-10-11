import type { mAdmin } from "@server/db/models/admin.model";
import AdminModel from "@server/db/models/admin.model";
import type { mUser } from "@server/db/models/user.model";
import UserModel from "@server/db/models/user.model";
import type { Role } from "@server/db/schemas";
import { BaseUserService } from "./base-user.service";

type AnyServiceType = BaseUserService<mUser> | BaseUserService<mAdmin>;

const userModelInstance = new BaseUserService<mUser>(UserModel);
const adminModelInstance = new BaseUserService<mAdmin>(AdminModel);

const serviceMap = new Map<Lowercase<Role>, AnyServiceType>();

serviceMap.set("user", userModelInstance);
serviceMap.set("admin", adminModelInstance);

export function getServiceForRole(role: Role): AnyServiceType {
  const service = serviceMap.get(role.toLowerCase() as Lowercase<Role>);
  if (!service) {
    throw new Error(`No service found for role: ${role}`);
  }
  return service;
}
