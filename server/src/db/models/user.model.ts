import { UserRole, zBaseUser, type BaseUser } from "@server/db/schemas";
import { CRYPTO } from "@server/app";
import { RolePermissions } from "@server/lib/permissions";
import mongoose, { model, type Document } from "mongoose";
import z from "zod";

export const zUserSchema = zBaseUser().extend({
  role: UserRole.default("User"),
});

export type User = BaseUser & z.infer<typeof zUserSchema>;

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
    googleId: String,
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    profileImg: String,
    refreshToken: { type: [String], default: [] },
    otpSecret: {
      type: String,
      require: true,
    },
    twoFactorEnabled: { required: true, default: true, type: Boolean },
    isVerified: { required: true, default: false, type: Boolean },
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
  if (this.isModified("password") && !this.googleId) {
    const hashedPassword = await Bun.password.hash(this.password, {
      algorithm: "bcrypt",
      cost: 10,
    });
    this.password = hashedPassword;
  }

  next();
});

mUserSchema.pre("save", async function (next) {
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

mUserSchema.pre("save", async function (next) {
  if (this.isModified("otpSecret")) {
    const userSecret = await CRYPTO.encrypt(this.otpSecret);
    this.otpSecret = userSecret;
  }
  next();
});

const UserModel = mongoose.model<mUser>("User", mUserSchema);

export default UserModel;
