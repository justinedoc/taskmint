import { UserRole, zBaseUser, type BaseUser } from "@server/db/schemas";
import { RolePermissions } from "@server/lib/permissions";
import mongoose, { model, type Document } from "mongoose";
import z from "zod";

export const zUserSchema = zBaseUser().extend({
  role: UserRole.default("User"),
});

export type User = BaseUser & z.infer<typeof zUserSchema> & {};

export type mUser = User & Document;

const mUserSchema = new mongoose.Schema<mUser>(
  {
    role: { type: String, required: true, enum: ["User"], default: "User" },
    permissions: {
      type: [String],
      default: RolePermissions.user,
      required: true,
    },
    fullname: { type: String, required: true },
    username: String,
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    profileImg: String,
    refreshToken: { type: [String], default: [] },
  },
  { timestamps: true }
);

mUserSchema.methods.comparePassword = async function (
  this: User,
  password: string
): Promise<boolean> {
  return Bun.password.verify(password, this.password);
};

mUserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = await Bun.password.hash(this.password, {
      algorithm: "bcrypt",
      cost: 10,
    });
    this.password = hashedPassword;
  }

  if (!this.username && this.email) {
    const base = this.email.split("@")[0];
    let candidate = base;
    let count = 1;

    while (await model("User").exists({ username: candidate })) {
      candidate = `${base}${count++}`;
    }
    this.username = candidate;
  }

  next();
});

mUserSchema.post("findOneAndDelete", async function (deletedUser: User) {
  if (deletedUser) {
    await model<User>("User").deleteMany({ user: deletedUser._id });
  }
});

const UserModel = mongoose.model<mUser>("User", mUserSchema);

export default UserModel;
