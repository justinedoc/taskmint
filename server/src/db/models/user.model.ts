import { UserRole, zBaseUser, type BaseUser } from "@server/db/schemas";
import mongoose, { model, type Document } from "mongoose";
import z from "zod";

const zUserSchema = zBaseUser().extend({
  role: UserRole.default("User"),
});

export type User = BaseUser & z.infer<typeof zUserSchema> & {};

export type mUser = User & Document;

const mUserSchema = new mongoose.Schema<mUser>({});

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

  if (!this.username) {
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
