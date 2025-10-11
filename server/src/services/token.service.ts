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

    const now = Math.floor(Date.now() / 1000);
    const accessTokenExp = now + 60 * 15;
    const refreshTokenExp = now + 60 * 60 * 24 * 7;

    const accessToken = await sign(
      { ...payload, exp: accessTokenExp },
      env.ACCESS_TOKEN_SECRET
    );
    const refreshToken = await sign(
      { ...payload, exp: refreshTokenExp },
      env.REFRESH_TOKEN_SECRET
    );

    return { accessToken, refreshToken };
  }

  public async createOtpToken({
    id,
    role,
    permissions,
  }: {
    id: Types.ObjectId | string;
    role: Role;
    permissions?: string[];
  }): Promise<string> {
    const payload: TokenPayload = {
      id: id.toString(),
      role,
      permissions,
    };

    const now = Math.floor(Date.now() / 1000);
    const otpTokenExp = now + 60 * 5;

    const otpToken = await sign(
      { ...payload, exp: otpTokenExp },
      env.OTP_TOKEN_SECRET
    );

    return otpToken;
  }

  public async verifyToken(
    token: string,
    secret: string
  ): Promise<TokenPayload> {
    return (await verify(token, secret)) as TokenPayload;
  }

  async verifyAccessToken(token: string) {
    return await this.verifyToken(token, env.ACCESS_TOKEN_SECRET);
  }

  async verifyRefreshToken(token: string) {
    return await this.verifyToken(token, env.REFRESH_TOKEN_SECRET);
  }

  async verifyOtpToken(token: string) {
    return await this.verifyToken(token, env.OTP_TOKEN_SECRET);
  }
}

const tokenService = new TokenService();

export default tokenService;
