import env from "@server/app/validate-env";
import type { Context } from "hono";
import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";

export class CookieService {
  private static readonly REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60;
  private static readonly ACCESS_COOKIE_MAX_AGE = 15 * 60;

  private static readonly cookieOptions = {
    httpOnly: true,
    secure: env.ENV === "production",
    sameSite: "Lax",
  } as const;

  public static async setAccessCookie(
    c: Context,
    accessToken: string
  ): Promise<void> {
    await setSignedCookie(
      c,
      "access_token",
      accessToken,
      env.ACCESS_COOKIE_SECRET,
      {
        ...this.cookieOptions,
        maxAge: this.ACCESS_COOKIE_MAX_AGE,
      }
    );
  }

  public static async setRefreshCookie(
    c: Context,
    refreshToken: string
  ): Promise<void> {
    await setSignedCookie(
      c,
      "refresh_token",
      refreshToken,
      env.REFRESH_COOKIE_SECRET,
      {
        ...this.cookieOptions,
        maxAge: this.REFRESH_COOKIE_MAX_AGE,
      }
    );
  }

  public static async setAuthCookies(
    c: Context,
    tokens: { accessToken: string; refreshToken: string }
  ): Promise<void> {
    await Promise.all([
      this.setAccessCookie(c, tokens.accessToken),
      this.setRefreshCookie(c, tokens.refreshToken),
    ]);
  }

  public static deleteAccessCookie(c: Context): void {
    deleteCookie(c, "access_token");
  }

  public static deleteRefreshCookie(c: Context): void {
    deleteCookie(c, "refresh_token");
  }

  public static deleteAuthCookies(c: Context): void {
    this.deleteAccessCookie(c);
    this.deleteRefreshCookie(c);
  }

  public static async getAccessCookie(c: Context) {
    return getSignedCookie(c, env.ACCESS_COOKIE_SECRET, "access_token");
  }

  public static async getRefreshCookie(c: Context) {
    return getSignedCookie(c, env.REFRESH_COOKIE_SECRET, "refresh_token");
  }
}
