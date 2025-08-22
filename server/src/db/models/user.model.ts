import type { BaseUser } from "@server/db/schemas";
import mongoose, { type Document, model } from "mongoose";

export type User = BaseUser & {
  role: "user";
  // TODO: Add any additional fields or methods specific to the User model here
};

export type mUser = User & Document;

const mUserSchema = new mongoose.Schema<mUser>({
  // TODO: Add any additional fields or methods specific to the User model here
});

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

const User = mongoose.model<User>("User", mUserSchema);

export default User;
