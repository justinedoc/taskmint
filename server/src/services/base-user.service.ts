import type { User } from "@server/db/models/user.model";
import type { Document, Model, Types } from "mongoose";

type FindableFields = "email" | "username" | "_id";

export class BaseUserService<T extends Document> {
  public readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async exists(value: string, path: FindableFields = "_id") {
    return this.model.exists({ [path]: value } as Record<string, unknown>);
  }

  async findById(id: string) {
    return this.model.findById(id);
  }

  async findByField(path: FindableFields, value: string) {
    return this.model.findOne({ [path]: value } as Record<string, unknown>);
  }

  async create(
    data: Omit<User, "_id" | "role" | "refreshToken" | "comparePassword">
  ) {
    const user = new this.model(data);
    await user.save();
    return user;
  }

  async update(id: string, data: Partial<User>) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  async addRefreshToken(userId: string | Types.ObjectId, refreshToken: string) {
    return this.model.findByIdAndUpdate(
      userId,
      { $addToSet: { refreshToken } },
      { new: true }
    );
  }

  async removeRefreshToken(
    userId: string | Types.ObjectId,
    refreshToken: string
  ) {
    return this.model.findByIdAndUpdate(userId, { $pull: { refreshToken } });
  }

  async findByRefreshToken(id: Types.ObjectId | string, token: string) {
    return this.model.findOne({ _id: id, refreshToken: token });
  }
}
