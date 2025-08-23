import { AuthError } from "@server/errors/auth.error";
import tokenService, {
  type TokenPayload,
} from "@server/services/token.service";
import { Types, type Document } from "mongoose";
import type { BaseUserService } from "./base-user.service";

export class AuthService<T extends Document> {
  private readonly service: BaseUserService<T>;

  constructor(userService: BaseUserService<T>) {
    this.service = userService;
  }

  private async generateTokens(payload: TokenPayload) {
    return tokenService.createTokenPair(payload);
  }

  async refreshAuth(refreshToken: string) {
    const decoded = await tokenService.verifyRefreshToken(refreshToken);

    if (!decoded) {
      throw new AuthError("Invalid refresh token. Please log in again.");
    }

    const userId = new Types.ObjectId(decoded.id);
    const user = await this.service.findByRefreshToken(userId, refreshToken);

    if (!user) {
      await this.service.removeRefreshToken(userId, refreshToken);
      throw new AuthError("Invalid refresh token. Please log in again.");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(decoded);

    await Promise.all([
      this.service.removeRefreshToken(String(user._id), refreshToken),
      this.service.addRefreshToken(String(user._id), newRefreshToken),
    ]);

    return { accessToken, refreshToken: newRefreshToken };
  }
}
