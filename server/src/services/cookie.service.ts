import env from "@server/app/validate-env";
import type { Context } from "hono";
import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";

class CookieService {
  private REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60;
  private ACCESS_COOKIE_MAX_AGE = 15 * 60;

  private cookieOptions = {
    httpOnly: true,
    secure: env.ENV === "production",
    sameSite: "Lax",
  } as const;

  async setAccessCookie(c: Context, accessToken: string): Promise<void> {
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

  async setRefreshCookie(c: Context, refreshToken: string): Promise<void> {
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

  async setAuthCookies(
    c: Context,
    tokens: { accessToken: string; refreshToken: string }
  ): Promise<void> {
    await Promise.all([
      this.setAccessCookie(c, tokens.accessToken),
      this.setRefreshCookie(c, tokens.refreshToken),
    ]);
  }

  deleteAccessCookie(c: Context): void {
    deleteCookie(c, "access_token");
  }

  deleteRefreshCookie(c: Context): void {
    deleteCookie(c, "refresh_token");
  }

  deleteAuthCookies(c: Context): void {
    this.deleteAccessCookie(c);
    this.deleteRefreshCookie(c);
  }

  async getAccessCookie(c: Context) {
    return getSignedCookie(c, env.ACCESS_COOKIE_SECRET, "access_token");
  }

  async getRefreshCookie(c: Context) {
    return getSignedCookie(c, env.REFRESH_COOKIE_SECRET, "refresh_token");
  }
}

const cookieService = new CookieService();
export default cookieService;
