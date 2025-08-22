import type { User } from "@server/db/models/user.model";
import type { Document, Model, Types } from "mongoose";

const excludePrivateFields = "-refreshToken -comparePassword -password -__v";

type FindableFields = "email" | "username" | "_id";
type incomingUser = Omit<
  User,
  "_id" | "role" | "refreshToken" | "comparePassword"
>;

export class BaseUserService<T extends Document> {
  readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  // User actions

  async exists(path: FindableFields = "_id", value: string) {
    return this.model.exists({ [path as string]: value } as Record<
      string,
      unknown
    >);
  }

  async createUser(data: incomingUser) {
    const user = new this.model(data);
    await user.save();
    return user;
  }

  async getUserById(id: string) {
    return this.model.findById(id);
  }

  async getUserByEmail(email: string) {
    return this.model.findOne({ email });
  }

  async getUserByRefreshTokenAndId(token: string, id: Types.ObjectId) {
    return this.model
      .findOne({ _id: id, refreshToken: token })
      .select(excludePrivateFields);
  }

  async updateUser(id: string, data: Partial<incomingUser>) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteUser(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  // Token actions

  async updateRefreshToken(
    userId: string | Types.ObjectId,
    refreshToken: string
  ) {
    return this.model.findByIdAndUpdate(
      userId,
      { $addToSet: { refreshToken } },
      { new: true, upsert: true }
    );
  }

  async clearRefreshToken(
    userId: string | Types.ObjectId,
    refreshToken: string
  ) {
    return this.model.findByIdAndUpdate(userId, { $pull: { refreshToken } });
  }
}
