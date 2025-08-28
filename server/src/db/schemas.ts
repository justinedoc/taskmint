import { isValidObjectId, Types } from "mongoose";
import z from "zod";

export const UserRole = z.enum(["User", "Admin", "Guest", "Superadmin"]);

export function zSignin() {
  return z.object({
    email: z.email(),
    password: z.string(),
  });
}

// Zod schema for getting a user by ID
export function zGetById() {
  return z.object({
    id: z.string({ error: "User ID is required" }).refine(isValidObjectId, {
      error: "Invalid User ID format",
    }),
  });
}

// Zod schema for updating user data
export function zUpdateUserData() {
  return z.object({
    id: z.string().refine(isValidObjectId, {
      message: "Invalid User ID format",
    }),
    data: z
      .object({
        firstname: z.string().min(1).max(100),
        lastname: z.string().min(1).max(100),
        username: z.string().min(1).max(100),
        email: z.email("Please use a valid email"),
      })
      .partial(),
  });
}

export function zBaseUser() {
  return z.object({
    fullname: z.string().min(1).max(50),
    permissions: z.array(z.string()).optional(),
    username: z.string().max(100).optional(),
    email: z.email("Please use a valid email"),
    refreshToken: z.array(z.string()).optional(),
    profileImg: z.string().optional(),
    password: z
      .string()
      .min(8)
      .max(50)
      .refine((val) => {
        return /[a-zA-Z]/.test(val) && /[0-9]/.test(val);
      }, "Password must contain at least one letter and one number"),
  });
}

export function zPasswordUpdate() {
  return z.object({
    oldPassword: zBaseUser().shape.password,
    newPassword: zBaseUser().shape.password,
  });
}

export type BaseUser = {
  _id: Types.ObjectId;
  otpSecret: string;
  comparePassword: (password: string) => Promise<boolean>;
};

export type Role = z.infer<typeof UserRole>;
