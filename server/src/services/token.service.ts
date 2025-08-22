import env from "@server/app/validate-env";
import type { Role } from "@server/db/schemas";
import { sign, verify } from "hono/jwt";
import type { JWTPayload } from "hono/utils/jwt/types";
import type { Types } from "mongoose";

export interface TokenPayload extends JWTPayload {
  id: string;
  role: Role;
  permissions?: string[];
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class TokenService {
  private readonly ACCESS_TOKEN_EXP = Math.floor(Date.now() / 1000) + 60 * 15;
  private readonly REFRESH_TOKEN_EXP =
    Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;

  public async createTokenPair({
    id,
    role,
    permissions,
  }: {
    id: Types.ObjectId | string;
    role: Role;
    permissions?: string[];
  }): Promise<TokenPair> {
    const payload: TokenPayload = {
      id: id.toString(),
      role,
      permissions,
    };

    const accessToken = await sign(
      { ...payload, exp: this.ACCESS_TOKEN_EXP },
      env.ACCESS_TOKEN_SECRET
    );
    const refreshToken = await sign(
      { ...payload, exp: this.REFRESH_TOKEN_EXP },
      env.REFRESH_TOKEN_SECRET
    );

    return { accessToken, refreshToken };
  }

  public async verifyToken(
    token: string,
    secret: string
  ): Promise<TokenPayload> {
    return (await verify(token, secret)) as TokenPayload;
  }

  async verifyAccessToken(token: string) {
    return this.verifyToken(token, env.ACCESS_TOKEN_SECRET);
  }

  async verifyRefreshToken(token: string) {
    return this.verifyToken(token, env.REFRESH_TOKEN_SECRET);
  }
}

const tokenService = new TokenService();

export default tokenService;
