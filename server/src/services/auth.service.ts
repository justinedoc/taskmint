import { AuthError } from "@server/errors/auth.error";
import tokenService, {
  type TokenPayload,
} from "@server/services/token.service";
import { Types, type Document } from "mongoose";

interface AuthenticatableService<T extends Document> {
  findByRefreshToken(id: Types.ObjectId, token: string): Promise<T | null>;
  addRefreshToken(
    userId: string | Types.ObjectId,
    refreshToken: string
  ): Promise<T | null>;
  removeRefreshToken(
    userId: string | Types.ObjectId,
    refreshToken: string
  ): Promise<T | null>;
}

export class AuthService<T extends Document> {
  private readonly userService: AuthenticatableService<T>;

  constructor(userService: AuthenticatableService<T>) {
    this.userService = userService;
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
    const user = await this.userService.findByRefreshToken(
      userId,
      refreshToken
    );

    if (!user) {
      await this.userService.removeRefreshToken(userId, refreshToken);
      throw new AuthError("Invalid refresh token. Please log in again.");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(decoded);

    await Promise.all([
      this.userService.removeRefreshToken(String(user._id), refreshToken),
      this.userService.addRefreshToken(String(user._id), newRefreshToken),
    ]);

    return { accessToken, refreshToken: newRefreshToken };
  }
}
