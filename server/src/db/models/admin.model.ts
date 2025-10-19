import {
  UserRole,
  zBaseUser,
  type BaseUser,
} from "@server/db/z-schemas/user.schemas";
import mongoose, { Document } from "mongoose";
import z from "zod";

const zAdminSchema = zBaseUser().extend({
  role: UserRole.default("Admin"),
});

export type Admin = BaseUser & z.infer<typeof zAdminSchema>;

export type mAdmin = Admin & Document;

const mAdminSchema = new mongoose.Schema<mAdmin>({});

mAdminSchema.methods.comparePassword = async function (
  this: Admin,
  password: string
): Promise<boolean> {
  return Bun.password.verify(password, this.password);
};

mAdminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = await Bun.password.hash(this.password, {
      algorithm: "bcrypt",
      cost: 10,
    });
    this.password = hashedPassword;
  }

  next();
});

const Admin = mongoose.model<mAdmin>("Admin", mAdminSchema);

export default Admin;
